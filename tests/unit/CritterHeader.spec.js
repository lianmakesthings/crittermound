import { mount } from '@vue/test-utils'
import CritterHeader from '../../src/components/CritterHeader';
import { expect } from "chai";

describe('The critterHeader view', () => {
  it('should set the correct background color', () => {
    const wrapperPink = mount(CritterHeader, {
      propsData: {
        bgColor: '#f2dede'
      }
    });
    const wrapperBlue = mount(CritterHeader, {
      propsData: {
        bgColor: '#d9edf7'
      }
    });

    expect(wrapperPink.element.style.background).to.equal('rgb(242, 222, 222)');
    expect(wrapperBlue.element.style.background).to.equal('rgb(217, 237, 247)');
  });
});