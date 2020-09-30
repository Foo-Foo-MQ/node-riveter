/* global describe it */

import Riveter from '../lib/riveter'
import expect = require('expect.js');

describe('riveter - constructor.punch', function () {
  let mixinA = {
    greet: function(this: any): string {
      return 'Oh, hai ' + this.name
    }
  }

  let mixinB = {
    greet: function(this: any): string {
      return 'BOO! ' + this.name
    }
  }

  let mixinC = {
    sayGoodbye: function(this: any): string {
      return 'Buh Bye ' + this.name
    }
  }

  describe('when calling punch with one argument', function () {
    let F2 = function(this: any, val: string) {
      this.name = val
    }
    Riveter.init(F2);
    (F2 as any).punch(mixinA)
    let f2 = new F2('Who')

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
      expect(Object.prototype.hasOwnProperty.call(F2, 'punch')).to.be(true)
    })
  })

  describe('when calling punch with two arguments', function () {
    let F2 = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F2);
    (F2 as any).punch(mixinA, mixinC)
    let f2 = new F2('Who')

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
      expect(Object.prototype.hasOwnProperty.call(F2, 'punch')).to.be(true)
    })
  })

  describe('when mixin methods collide with prototype methods', function () {
    let F2 = function (this: any, val: string) {
      this.name = val
    }
    F2.prototype.greet = function () {
      return 'Hello ' + this.name
    }
    Riveter.init(F2);
    (F2 as any).punch(mixinA)
    let f2 = new F2('Who')

    it('mix-in should override prototype', function () {
      expect(f2.greet()).to.be('Oh, hai Who')
    })

    it('should apply shared/constructor methods', function () {
      expect(Object.prototype.hasOwnProperty.call(F2, 'mixin')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'extend')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'inherits')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'compose')).to.be(true)
      expect(Object.prototype.hasOwnProperty.call(F2, 'punch')).to.be(true)
    })
  })

  describe('when mixin methods collide with other mixin methods', function () {
    let F2 = function (this: any, val: string) {
      this.name = val
    }
    Riveter.init(F2);
    (F2 as any).punch(mixinB, mixinA)
    let f2 = new F2('Who')
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
      expect(Object.prototype.hasOwnProperty.call(F2, 'punch')).to.be(true)
    })
  })
})
