import 'should';
import sinon from 'sinon';

describe('sinonSpyTest', () => {
    describe('sinon: sinon.spy', () => {
        it('spy.called', () => {
            let sinonSpy = sinon.stub();
            expect(sinonSpy.called).toEqual(false);
            sinonSpy();
            expect(sinonSpy.called).toEqual(true);
        });

        it('spy.notcalled', () => {
            let sinonSpy = sinon.stub();
            expect(sinonSpy.notCalled).toEqual(true);
            sinonSpy();
            expect(sinonSpy.notCalled).toEqual(false);
        });

        it('jest.spy.called', () => {
            let jestSpy = jest.fn();
            jestSpy('call');
            jestSpy('twice');
            const expected = JSON.stringify(["call", "twice"]);
            const received = JSON.stringify(jestSpy.mock.calls.map(x => x.toString()));
            received.should.equal(received);
        });
    });
});

describe('checking arguments', () => {
    describe('sinon', () => {
        it('spy,args', () => {
            const sinonSpy = sinon.stub();
            sinonSpy(1, 2);
            sinonSpy.args[0][0].should.equal(1);
            sinonSpy.args[0][1].should.equal(2);
        });

        it('spy.calledWith', () => {
            const sinonSpy = sinon.stub();
            sinonSpy(1, 2);
            sinonSpy.calledWith(1, 2).should.equal(true);
        });
    });
    describe('jest', () => {
        it('jest spy,args', () => {
            const jestSpy = jest.fn();
            jestSpy(1, 2);
            jestSpy.mock.calls[0][0].should.equal(1);
            jestSpy.mock.calls[0][1].should.equal(2);
        });
        it('jest spy,toHaveBeenCalledWith', () => {
            const jestSpy = jest.fn();
            jestSpy(1, 2);
            expect(jestSpy).toHaveBeenCalledWith(1, 2);
        });
    });
});

describe('spy on method', () => {
    const someObject = {
        id: 43,
        model: 'sample',
        getModel: function () {
            // console.log('actually called');
            return this.model;
        }
    };
    it('sinon.spy(obj, "method")', () => {
        const sinonSpy = sinon.stub(someObject, 'getModel');
        someObject.getModel();
        expect(sinonSpy.called).toEqual(true);
        sinonSpy.restore();
    });
    it('jest.spyOn(obj, "method")', () => {
        const jestSpy = jest.spyOn(someObject, 'getModel');
        someObject.getModel();
        expect(jestSpy).toHaveBeenCalled();
        jestSpy.mockRestore();
    });
});

describe('sinon stub and jest', () => {
    const operations = {
        add: (num1: any, num2: any) => {
            return num1 + num2;
        },
        add2: (num1: any, num2: any, num3: any) => {
            return num1 + num2 + num3;
        }
    }
    it('sinon.stub(obj, "method")', () => {
        const sinonStub = sinon.stub(operations, 'add');
        sinonStub.returns(33);
        operations.add(1, 2).should.equal(33);
    });
    it('sinon.withArgs(.,.,.).returns(.)', () => {
        const sinonStub = sinon.stub(operations, 'add2');
        sinonStub.withArgs(1, 2, 3).returns(6);
    });
});