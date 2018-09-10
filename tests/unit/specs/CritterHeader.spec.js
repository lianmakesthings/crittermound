import Vue from 'vue';
import CritterHeader from '@/components/CritterHeader';

describe('The critterHeader view', () => {
  it('should set the correct background color', () => {
    const Constructor = Vue.extend(CritterHeader);
    const vm = new Constructor({
      propsData: {
        bgColor: '#f2dede'
      }
    }).$mount();
    console.log(vm.$el)
  });
});