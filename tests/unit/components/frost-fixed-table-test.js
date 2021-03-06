/**
 * Unit test for the frost-fixed-table component
 *
 * NOTE: Since it is not easy to properly set up an integration test to confirm some of the DOM
 * calculations happening in frost-fixed-table, I opted to unit test these calculations, making these
 * tests a little more tied to the implementation than I'd like. However, given the hoops needed to jump through to
 * simulate external CSS as well as scroll and mouse events, this seemed the better option (@job13er 2016-12-13)
 */

import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {createSelectorStub} from 'dummy/tests/helpers/selector-stub'

function _rewriteIndices (cols) {
  return cols.map((column, index) => Object.assign({index}, column))
}

const test = unit('frost-fixed-table')
describe(test.label, function () {
  test.setup()

  let component, columns, indexedColumns, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      columns: [],
      hook: 'table',
      hookQualifiers: {foo: 'bar'},
      items: [],
      tagName: 'div'
    })

    columns = [
      {
        frozen: true,
        propertyName: 'name'
      },
      {
        frozen: true,
        propertyName: 'description',
        category: 'Infomation'
      },
      {
        propertyName: 'info1',
        category: 'Infomation'
      },
      {
        propertyName: 'info2',
        category: 'Infomation'
      },
      {
        propertyName: 'info3',
        category: 'Infomation'
      },
      {
        frozen: true,
        propertyName: 'summary1',
        category: 'Summary'
      },
      {
        frozen: true,
        propertyName: 'summary2',
        category: 'Summary'
      }
    ]

    // The table component should add these for hooks.
    indexedColumns = _rewriteIndices(columns)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('Computed Properties', function () {
    const cpExpectedValues = {
      _bodyLeftSelector: '.frost-fixed-table-left .frost-scroll',
      _bodyMiddleSelector: '.frost-fixed-table-middle .frost-scroll',
      _bodyRightSelector: '.frost-fixed-table-right .frost-scroll',
      _headerMiddleSelector: '.frost-fixed-table-header-middle .frost-scroll',
      _headerLeftSelector: '.frost-fixed-table-header-left',
      _headerRightSelector: '.frost-fixed-table-header-right'
    }

    for (let key in cpExpectedValues) {
      describe(key, function () {
        let value
        beforeEach(function () {
          value = component.get(key)
        })

        it('should return the expected value', function () {
          expect(value).to.equal(cpExpectedValues[key])
        })
      })
    }

    describe('leftColumns', function () {
      describe('with properly ordered columns', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have the first frozen columns', function () {
          expect(component.get('leftColumns')).to.eql(indexedColumns.slice(0, 2))
        })
      })

      describe('with no leading frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(2))
        })

        it('should be empty', function () {
          expect(component.get('leftColumns')).to.eql([])
        })
      })

      describe('with no columns', function () {
        beforeEach(function () {
          component.set('columns', [])
        })

        it('should be empty', function () {
          expect(component.get('leftColumns')).to.eql([])
        })
      })
    })

    describe('middleColumns', function () {
      describe('with properly ordered columns', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have the middle non-frozen columns', function () {
          expect(component.get('middleColumns')).to.eql(indexedColumns.slice(2, 5))
        })
      })

      describe('with no leading frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(2))
        })

        it('should have the first non-frozen columns', function () {
          expect(component.get('middleColumns')).to.eql(_rewriteIndices(columns.slice(2, 5)))
        })
      })

      describe('with no trailing frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(0, 5))
        })

        it('should have the last non-frozen columns', function () {
          expect(component.get('middleColumns')).to.eql(indexedColumns.slice(2, 5))
        })
      })

      describe('with no unfrozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(0, 2))
        })

        it('should be empty', function () {
          expect(component.get('middleColumns')).to.eql([])
        })
      })
    })

    describe('rightColumns', function () {
      describe('with properly ordered columns', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have the last frozen columns', function () {
          expect(component.get('rightColumns')).to.eql(indexedColumns.slice(-2))
        })
      })

      describe('with no trailing frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(0, 5))
        })

        it('should be empty', function () {
          expect(component.get('rightColumns')).to.eql([])
        })
      })

      describe('with no columns', function () {
        beforeEach(function () {
          component.set('columns', [])
        })

        it('should be empty', function () {
          expect(component.get('rightColumns')).to.eql([])
        })
      })
    })
  })

  describe('.didRender()', function () {
    beforeEach(function () {
      sandbox.stub(component, 'setupBodyHeights')
      sandbox.stub(component, 'setupHoverProxy')
      sandbox.stub(component, 'setupLeftAndRightWidths')
      sandbox.stub(component, 'setupMiddleMargins')
      sandbox.stub(component, 'setupMiddleWidths')
      sandbox.stub(component, 'setupScrollSync')

      component.didRender()
    })

    it('should set up the body heights', function () {
      expect(component.setupBodyHeights).to.have.callCount(1)
    })

    it('should set up the hover proxy', function () {
      expect(component.setupHoverProxy).to.have.callCount(1)
    })

    it('should set up the left and right widths', function () {
      expect(component.setupLeftAndRightWidths).to.have.callCount(1)
    })

    it('should set up the middle margins', function () {
      expect(component.setupMiddleMargins).to.have.callCount(1)
    })

    it('should set up the middle widths', function () {
      expect(component.setupMiddleWidths).to.have.callCount(1)
    })

    it('should set up the scroll syncing', function () {
      expect(component.setupScrollSync).to.have.callCount(1)
    })
  })

  describe('._calculateWidth()', function () {
    // TODO: add tests, need to figure out how to stub Ember.$ properly for this one

  })

  describe('.setupBodyHeights()', function () {
    let leftBodyStub, middleHeaderStub, middleBodyStub, rightBodyStub, tableStub, nonEmptyCellStub, emptyRowStub
    beforeEach(function () {
      leftBodyStub = createSelectorStub('css')
      middleBodyStub = createSelectorStub('css')
      middleHeaderStub = createSelectorStub('outerHeight')
      rightBodyStub = createSelectorStub('css')
      nonEmptyCellStub = createSelectorStub('outerHeight')
      emptyRowStub = createSelectorStub('css')
      tableStub = createSelectorStub('outerHeight')

      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-left .frost-scroll').returns(leftBodyStub)
        .withArgs('.frost-fixed-table-middle .frost-scroll').returns(middleBodyStub)
        .withArgs('.frost-fixed-table-header-middle .frost-scroll').returns(middleHeaderStub)
        .withArgs('.frost-fixed-table-right .frost-scroll').returns(rightBodyStub)
        .withArgs('.frost-table-row:not(:empty) .frost-table-row-cell').returns(nonEmptyCellStub)
        .withArgs('.frost-table-row:empty').returns(emptyRowStub)
        .withArgs().returns(tableStub)

      tableStub.outerHeight.returns(100)
      middleHeaderStub.outerHeight.returns(20)
      nonEmptyCellStub.outerHeight.returns(50)

      component.setupBodyHeights()
    })

    it('should set the height of the left body', function () {
      expect(leftBodyStub.css).to.have.been.calledWith({height: '80px'})
    })

    it('should set the height of the middle body', function () {
      expect(middleBodyStub.css).to.have.been.calledWith({height: '80px'})
    })

    it('should set the height of the right body', function () {
      expect(rightBodyStub.css).to.have.been.calledWith({height: '80px'})
    })

    it('should set the height of empty rows', function () {
      expect(emptyRowStub.css).to.have.been.calledWith({height: '50px'})
    })
  })

  describe('.setupHoverProxy()', function () {
    let leftBodyStub, middleHeaderStub, middleBodyStub, rightBodyStub
    let leftBodyMouseEnterHandler, leftBodyMouseLeaveHandler
    let middleBodyMouseEnterHandler, middleBodyMouseLeaveHandler
    let middleHeaderMouseEnterHandler, middleHeaderMouseLeaveHandler

    beforeEach(function () {
      leftBodyStub = createSelectorStub('on')
      middleBodyStub = createSelectorStub('on', 'addClass', 'removeClass')
      middleHeaderStub = createSelectorStub('on')
      rightBodyStub = createSelectorStub('addClass', 'removeClass')

      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-left .frost-scroll').returns(leftBodyStub)
        .withArgs('.frost-fixed-table-middle .frost-scroll').returns(middleBodyStub)
        .withArgs('.frost-fixed-table-header-middle .frost-scroll').returns(middleHeaderStub)
        .withArgs('.frost-fixed-table-right .frost-scroll').returns(rightBodyStub)

      component.setupHoverProxy()

      // capture the event handlers
      leftBodyMouseEnterHandler = leftBodyStub.on.getCall(0).args[1]
      leftBodyMouseLeaveHandler = leftBodyStub.on.getCall(1).args[1]
      middleBodyMouseEnterHandler = middleBodyStub.on.getCall(0).args[1]
      middleBodyMouseLeaveHandler = middleBodyStub.on.getCall(1).args[1]
      middleHeaderMouseEnterHandler = middleHeaderStub.on.getCall(0).args[1]
      middleHeaderMouseLeaveHandler = middleHeaderStub.on.getCall(1).args[1]
    })

    it('should add mouseenter handler to left body', function () {
      expect(leftBodyStub.on).to.have.been.calledWith('mouseenter', sinon.match.func)
    })

    it('should add mouseleave handler to left body', function () {
      expect(leftBodyStub.on).to.have.been.calledWith('mouseleave', sinon.match.func)
    })

    it('should add mouseenter handler to middle body', function () {
      expect(middleBodyStub.on).to.have.been.calledWith('mouseenter', sinon.match.func)
    })

    it('should add mouseleave handler to middle body', function () {
      expect(middleBodyStub.on).to.have.been.calledWith('mouseleave', sinon.match.func)
    })

    it('should add mouseenter handler to middle header', function () {
      expect(middleHeaderStub.on).to.have.been.calledWith('mouseenter', sinon.match.func)
    })

    it('should add mouseleave handler to middle header', function () {
      expect(middleHeaderStub.on).to.have.been.calledWith('mouseleave', sinon.match.func)
    })

    describe('when left body is hovered', function () {
      beforeEach(function () {
        leftBodyMouseEnterHandler()
      })

      it('should add the hover class to the right body', function () {
        expect(rightBodyStub.addClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when left body is un-hovered', function () {
      beforeEach(function () {
        leftBodyMouseLeaveHandler()
      })

      it('should remove the hover class from the right body', function () {
        expect(rightBodyStub.removeClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle body is hovered', function () {
      beforeEach(function () {
        middleBodyMouseEnterHandler()
      })

      it('should add the hover class to the right body', function () {
        expect(rightBodyStub.addClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle body is un-hovered', function () {
      beforeEach(function () {
        middleBodyMouseLeaveHandler()
      })

      it('should remove the hover class from the right body', function () {
        expect(rightBodyStub.removeClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle header is hovered', function () {
      beforeEach(function () {
        middleHeaderMouseEnterHandler()
      })

      it('should add the hover class to the middle body', function () {
        expect(middleBodyStub.addClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle header is un-hovered', function () {
      beforeEach(function () {
        middleHeaderMouseLeaveHandler()
      })

      it('should remove the hover class from the middle body', function () {
        expect(middleBodyStub.removeClass).to.have.been.calledWith('ps-container-hover')
      })
    })
  })

  describe('.setupMiddleMargins()', function () {
    let leftBodyStub, middleHeaderStub, middleBodyStub, rightBodyStub
    beforeEach(function () {
      leftBodyStub = createSelectorStub('outerWidth')
      middleBodyStub = createSelectorStub('css')
      middleHeaderStub = createSelectorStub('css')
      rightBodyStub = createSelectorStub('outerWidth')

      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-left .frost-scroll').returns(leftBodyStub)
        .withArgs('.frost-fixed-table-middle .frost-scroll').returns(middleBodyStub)
        .withArgs('.frost-fixed-table-header-middle .frost-scroll').returns(middleHeaderStub)
        .withArgs('.frost-fixed-table-right .frost-scroll').returns(rightBodyStub)

      leftBodyStub.outerWidth.returns(123)
      rightBodyStub.outerWidth.returns(321)

      component.setupMiddleMargins()
    })

    it('should set proper margins on the middle header', function () {
      expect(middleHeaderStub.css).to.have.been.calledWith({
        'margin-left': '123px',
        'margin-right': '321px'
      })
    })

    it('should set proper margins on the middle body', function () {
      expect(middleBodyStub.css).to.have.been.calledWith({
        'margin-left': '123px',
        'margin-right': '321px'
      })
    })
  })

  describe('.setupLeftAndRightWidths()', function () {
    beforeEach(function () {
      sandbox.stub(component, 'alignColumns')
      component.setupLeftAndRightWidths()
    })

    it('should have called .alignedColumns() for left and right sections', function () {
      expect(component.alignColumns).to.have.callCount(2)
      expect(component.alignColumns).to.have.been.calledWithExactly(
        '.frost-fixed-table-header-left',
        '.frost-fixed-table-left .frost-scroll'
      )
      expect(component.alignColumns).to.have.been.calledWithExactly(
        '.frost-fixed-table-header-right',
        '.frost-fixed-table-right .frost-scroll'
      )
    })
  })

  describe('.setupMiddleWidths()', function () {
    let headerStub, middleHeaderStub, middleBodyStub
    beforeEach(function () {
      sandbox.stub(component, '_calculateWidth').returns(12345)
      sandbox.stub(component, '_categoryRowSelector').returns('')
      headerStub = createSelectorStub()
      middleHeaderStub = createSelectorStub('css')
      middleBodyStub = createSelectorStub('css')
      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-header-middle .frost-scroll .frost-table-header').returns(middleHeaderStub)
        .withArgs('.frost-fixed-table-middle .frost-scroll .frost-table-row').returns(middleBodyStub)
        .withArgs('.has-categories')
          .returns(headerStub)

      headerStub.length = 1
      sandbox.stub(component, 'alignColumns')

      component.setupMiddleWidths()
    })

    it('should set width of middle header', function () {
      expect(middleHeaderStub.css).to.have.been.calledWith({'width': '12345px', 'flex-basis': '12345px'})
    })

    it('should set width of middle body', function () {
      expect(middleBodyStub.css).to.have.been.calledWith({'width': '12345px', 'flex-basis': '12345px'})
    })

    it('should align header and body columns', function () {
      expect(component.alignColumns).to.have.been.calledWithExactly(
        '.frost-fixed-table-header-middle .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll'
      )
    })
  })

  describe('.setupScrollSync()', function () {
    beforeEach(function () {
      sandbox.stub(component, 'syncScrollLeft')
      sandbox.stub(component, 'syncScrollTop')

      component.setupScrollSync()
    })

    it('should setup horizontal syncing from header middle to body middle', function () {
      expect(component.syncScrollLeft).to.have.been.calledWith(
        '.frost-fixed-table-header-middle .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll'
      )
    })

    it('should setup horizontal syncing from body middle to header middle', function () {
      expect(component.syncScrollLeft).to.have.been.calledWith(
        '.frost-fixed-table-middle .frost-scroll',
        '.frost-fixed-table-header-middle .frost-scroll'
      )
    })

    it('should setup vertical syncing from body left to body middle and right', function () {
      expect(component.syncScrollTop).to.have.been.calledWith(
        '.frost-fixed-table-left .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll',
        '.frost-fixed-table-right .frost-scroll'
      )
    })

    it('should setup vertical syncing from body middle to body left and right', function () {
      expect(component.syncScrollTop).to.have.been.calledWith(
        '.frost-fixed-table-middle .frost-scroll',
        '.frost-fixed-table-left .frost-scroll',
        '.frost-fixed-table-right .frost-scroll'
      )
    })

    it('should setup vertical syncing from body right to body left and middle', function () {
      expect(component.syncScrollTop).to.have.been.calledWith(
        '.frost-fixed-table-right .frost-scroll',
        '.frost-fixed-table-left .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll'
      )
    })
  })

  describe('.syncScrollLeft()', function () {
    let srcStub, scrollHandler
    beforeEach(function () {
      srcStub = createSelectorStub('on', 'scrollLeft')
      sandbox.stub(component, '$').withArgs('src').returns(srcStub)
      component.syncScrollLeft('src', 'dst1', 'dst2', 'dst3')
      scrollHandler = srcStub.on.lastCall.args[1]
    })

    it('should lookup the source DOM element', function () {
      expect(component.$).to.have.been.calledWith('src')
    })

    it('should add a scroll event handler to the source DOM element', function () {
      expect(srcStub.on).to.have.been.calledWith('scroll', sinon.match.func)
    })

    describe('when the scroll even handler is called', function () {
      let dst1Stub, dst2Stub, dst3Stub
      beforeEach(function () {
        dst1Stub = createSelectorStub('scrollLeft')
        dst2Stub = createSelectorStub('scrollLeft')
        dst3Stub = createSelectorStub('scrollLeft')
        component.$.withArgs('dst1').returns(dst1Stub)
        component.$.withArgs('dst2').returns(dst2Stub)
        component.$.withArgs('dst3').returns(dst3Stub)

        srcStub.scrollLeft.returns(321)

        component.$.reset() // forget previous call
        scrollHandler()
      })

      it('should lookup the src DOM again', function () {
        expect(component.$).to.have.been.calledWith('src')
      })

      it('should set scrollLeft on the first destination', function () {
        expect(dst1Stub.scrollLeft).to.have.been.calledWith(321)
      })

      it('should set scrollLeft on the second destination', function () {
        expect(dst2Stub.scrollLeft).to.have.been.calledWith(321)
      })

      it('should set scrollLeft on the third destination', function () {
        expect(dst3Stub.scrollLeft).to.have.been.calledWith(321)
      })
    })
  })

  describe('.syncScrollTop()', function () {
    let srcStub, scrollHandler
    beforeEach(function () {
      srcStub = createSelectorStub('on', 'scrollTop')
      sandbox.stub(component, '$').withArgs('src').returns(srcStub)
      component.syncScrollTop('src', 'dst1', 'dst2', 'dst3')
      scrollHandler = srcStub.on.lastCall.args[1]
    })

    it('should lookup the source DOM element', function () {
      expect(component.$).to.have.been.calledWith('src')
    })

    it('should add a scroll event handler to the source DOM element', function () {
      expect(srcStub.on).to.have.been.calledWith('scroll', sinon.match.func)
    })

    describe('when the scroll even handler is called', function () {
      let dst1Stub, dst2Stub, dst3Stub
      beforeEach(function () {
        dst1Stub = createSelectorStub('scrollTop')
        dst2Stub = createSelectorStub('scrollTop')
        dst3Stub = createSelectorStub('scrollTop')
        component.$.withArgs('dst1').returns(dst1Stub)
        component.$.withArgs('dst2').returns(dst2Stub)
        component.$.withArgs('dst3').returns(dst3Stub)

        srcStub.scrollTop.returns(123)

        component.$.reset() // forget previous call
        scrollHandler()
      })

      it('should lookup the src DOM again', function () {
        expect(component.$).to.have.been.calledWith('src')
      })

      it('should set scrollTop on the first destination', function () {
        expect(dst1Stub.scrollTop).to.have.been.calledWith(123)
      })

      it('should set scrollTop on the second destination', function () {
        expect(dst2Stub.scrollTop).to.have.been.calledWith(123)
      })

      it('should set scrollTop on the third destination', function () {
        expect(dst3Stub.scrollTop).to.have.been.calledWith(123)
      })
    })
  })

  describe('.alignColumns()', function () {
    let headerStub, headerColumnsStub, headerColumn1Stub, headerColumn2Stub, bodyColumn1Stub, bodyColumn2Stub
    beforeEach(function () {
      headerStub = createSelectorStub()
      headerColumnsStub = createSelectorStub('eq', 'length')
      headerColumn1Stub = createSelectorStub('css', 'outerWidth')
      headerColumn2Stub = createSelectorStub('css', 'outerWidth')
      bodyColumn1Stub = createSelectorStub('css', 'outerWidth')
      bodyColumn2Stub = createSelectorStub('css', 'outerWidth')
      sandbox.stub(component, '_categoryRowSelector').returns('.frost-table-header-columns')
      sandbox.stub(component, '$')
        .withArgs('.header-class .frost-table-header-columns .frost-table-header-cell')
          .returns(headerColumnsStub)
        .withArgs('.body-class .frost-table-row .frost-table-row-cell:nth-child(1)')
          .returns(bodyColumn1Stub)
        .withArgs('.body-class .frost-table-row .frost-table-row-cell:nth-child(2)')
          .returns(bodyColumn2Stub)
        .withArgs('.has-categories')
          .returns(headerStub)

      headerStub.length = 1
      headerColumnsStub.length = 2
      headerColumnsStub.eq.withArgs(0).returns(headerColumn1Stub)
      headerColumnsStub.eq.withArgs(1).returns(headerColumn2Stub)

      headerColumn1Stub.outerWidth.returns(100)
      headerColumn2Stub.outerWidth.returns(20)

      bodyColumn1Stub.outerWidth.returns(20)
      bodyColumn2Stub.outerWidth.returns(100)

      component.alignColumns('.header-class', '.body-class')
    })

    it('should set width and flex-basis of body columns', function () {
      expect(bodyColumn1Stub.css).to.have.been.calledWith({'flex-basis': '100px', 'width': '100px'})
      expect(bodyColumn2Stub.css).to.have.been.calledWith({'flex-basis': '100px', 'width': '100px'})
    })

    it('should set width and flex-basis of header columns', function () {
      expect(headerColumn1Stub.css).to.have.been.calledWith({'flex-basis': '100px', 'width': '100px'})
      expect(headerColumn2Stub.css).to.have.been.calledWith({'flex-basis': '100px', 'width': '100px'})
    })
  })

  describe('onCallback', function () {
    let onCallback
    beforeEach(function () {
      onCallback = component.get('onCallback')
    })

    it('should default to a function', function () {
      // Normally this would be overridden, but we execute it so that coverage hs satisfied.
      expect(onCallback()).to.equal(undefined)
    })
  })
})
