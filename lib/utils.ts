import * as _ from 'lodash'

function getActualType(val: any): string {
  if (_.isArray(val)) {
    return 'array'
  }
  if (_.isDate(val)) {
    return 'date'
  }
  if (_.isRegExp(val)) {
    return 'regex'
  }
  return typeof val
}

const behavior: any = {
  '*': function (obj: any, sourcePropKey: any, sourcePropVal: any) {
    obj[sourcePropKey] = sourcePropVal
  },
  object: function (obj: any, sourcePropKey: any, sourcePropVal: any) {
    obj[sourcePropKey] = deepExtend(obj[sourcePropKey] || {}, sourcePropVal)
  },
  array: function (obj: any, sourcePropKey: any, sourcePropVal: any) {
    obj[sourcePropKey] = []
    _.each(sourcePropVal, function (item: any, idx: any) {
      behavior[getHandlerName(item)](obj[sourcePropKey], idx, item)
    })
  }
}

function getHandlerName(val: any) {
  const propType = getActualType(val)
  return behavior[propType] ? propType : '*'
}

export function deepExtend(obj: any, ...args: any[]) {
  _.each(Array.prototype.slice.call(arguments, 2), function (source: any) {
    _.each(source, function (sourcePropVal: any, sourcePropKey: string) {
      behavior[getHandlerName(sourcePropVal)](obj, sourcePropKey, sourcePropVal)
    })
  })
  return obj
}
