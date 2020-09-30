/* global describe it */

import Riveter from '../lib/riveter'
import expect = require('expect.js');

describe('riveter - constructor.mixin', function () {
  const mixinA = {
    greet: function(this: any) {
      return 'Oh, hai ' + this.name
    }
  }

  const mixinB = {
    greet: function(this: any) {
      return 'BOO! ' + this.name
    }
  }

  const mixinC = {
    sayGoodbye: function(this: any) {
      return 'Buh Bye ' + this.name
    }
  }

  describe('when calling mixin with one argument', function () {
    const F2: any = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F2);
    F2.mixin(mixinA)
    const f2 = new F2('Who')

    it('should apply mixin method to the instance', function () {
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

  describe('when calling mixin with two arguments', function () {
    const F2: any = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F2);
    F2.mixin(mixinA, mixinC)
    const f2 = new F2('Who')

    it('should apply mixin methods to the instance', function () {
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

  describe('when mixin methods collide with prototype methods', function () {
    const F2: any = function (this: any, val: string) {
      this.name = val
    }
    F2.prototype.greet = function () {
      return 'Hello ' + this.name
    }
    Riveter.init(F2);
    F2.mixin(mixinA)
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

  describe('when mixin methods collide with other mixin methods', function () {
    const F2: any = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F2);
    F2.mixin(mixinB, mixinA)
    const f2 = new F2('Who')
    it('should apply mixin method to the instance', function () {
      expect(f2).to.have.property('greet')
    })
    it('should produce expected mix-in behavior (last mixin wins)', function () {
      expect(f2.greet()).to.be('Oh, hai Who')
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
    })
  })
})
