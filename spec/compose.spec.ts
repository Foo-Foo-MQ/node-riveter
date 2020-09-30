/* global describe it */

import Riveter from '../lib/riveter'
import expect = require('expect.js');

describe('riveter - constructor.compose', function () {
  const mixinA = {
    greet: function(this: any) {
      return 'Oh, hai ' + this.name
    }
  }

  const mixinB = {
    _postInit: function (this: any, val: string) {
      this.otherName = 'Doctor ' + val
    },
    mixin: {
      saySomething: function(this: any) {
        return "'Stetsons are cool', said " + this.otherName
      }
    }
  }

  const mixinC = {
    sayGoodbye: function (this: any) {
      return 'Buh Bye ' + this.name
    }
  }

  const mixinD = {
    _preInit: function (this: any, val: string) {
      this.otherName = 'Doctor ' + val
    },
    mixin: {
      saySomething: function (this: any) {
        return "'Bowties are cool', said " + this.otherName
      }
    }
  }

  describe('when calling compose with one argument', function () {
    const F = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F);
    const F2 = (F as any).compose(mixinA)
    const f2 = new F2('Who')

    it('should apply compose method to the instance', function () {
      expect(f2).to.have.property('greet')
    })

    it('should produce expected mix-in behavior', function () {
      expect(f2.greet()).to.be('Oh, hai Who')
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
    })
  })

  describe('when calling compose with two arguments', function () {
    const F = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F)
    const F2 = (F as any).compose(mixinA, mixinC)
    const f2 = new F2('Who')

    it('should apply compose methods to the instance', function () {
      expect(f2).to.have.property('greet')
      expect(f2).to.have.property('sayGoodbye')
    })

    it('should produce expected behavior', function () {
      expect(f2.greet()).to.be('Oh, hai Who')
      expect(f2.sayGoodbye()).to.be('Buh Bye Who')
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
    })
  })

  describe('when composing a mixin containing a postInit method', function () {
    const F = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F)
    const F2 = (F as any).compose(mixinB)
    const f2 = new F2('Who')
    it('should apply mixin method to the instance', function () {
      expect(f2).to.have.property('saySomething')
    })
    it('should apply mixin property to the instance', function () {
      expect(f2.otherName).to.be('Doctor Who')
    })
    it('should produce expected mix-in behavior', function () {
      expect(f2.saySomething()).to.be("'Stetsons are cool', said Doctor Who")
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
    })
  })

  describe('when composin a mixin containing a preInit method', function () {
    var F = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F)
    const F2 = (F as any).compose(mixinD)
    const f2 = new F2('Who')
    it('should apply mixin method to the instance', function () {
      expect(f2).to.have.property('saySomething')
    })
    it('should apply mixin property to the instance', function () {
      expect(f2.otherName).to.be('Doctor Who')
    })
    it('should produce expected mix-in behavior', function () {
      expect(f2.saySomething()).to.be("'Bowties are cool', said Doctor Who")
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
    })
  })

  describe('when compose-mixins methods collide with prototype methods', function () {
    const F = function (this: any, val: string) {
      this.name = val
    }
    F.prototype.greet = function () {
      return 'Hello ' + this.name
    }
    Riveter.init(F)
    const F2 = (F as any).compose(mixinA)
    const f2 = new F2('Who')

    it('mix-in should **not** patch prototype', function () {
      expect(f2.greet()).to.be('Hello Who')
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
    })
  })

  describe('when compose-mixins methods collide with other compose-mixin methods', function () {
    const F = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F)
    const F2 = (F as any).compose(mixinB, mixinD)
    const f2 = new F2('Who')
    it('should apply mixin method to the instance', function () {
      expect(f2).to.have.property('saySomething')
    })
    it('should apply mixin property to the instance', function () {
      expect(f2.otherName).to.be('Doctor Who')
    })
    it('should produce expected mix-in behavior (last mixin wins)', function () {
      expect(f2.saySomething()).to.be("'Bowties are cool', said Doctor Who")
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
    })
  })
})
