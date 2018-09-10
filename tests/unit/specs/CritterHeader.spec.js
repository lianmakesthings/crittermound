import Vue from 'vue';
import CritterHeader from '@/components/CritterHeader';

describe('The critterHeader view', () => {
  it('should set the correct background color', () => {
    const Constructor = Vue.extend(CritterHeader);
    const vmPink = new Constructor({
      propsData: {
        bgColor: '#f2dede'
      }
    }).$mount();
    const vmBlue = new Constructor({
      propsData: {
        bgColor: '#d9edf7'
      }
    }).$mount();

    expect(vmPink.$el.style.background).to.equal('rgb(242, 222, 222)');
    expect(vmBlue.$el.style.background).to.equal('rgb(217, 237, 247)');
  });
});