import { mount } from '@vue/test-utils'
import CritterHeader from '../../src/components/CritterHeader.vue';
import { expect, describe, it } from "vitest";

describe('The critterHeader view', () => {
  it('should set the correct background color', () => {
    const wrapperPink = mount(CritterHeader, {
      props: {
        bgColor: '#f2dede'
      }
    });
    const wrapperBlue = mount(CritterHeader, {
      props: {
        bgColor: '#d9edf7'
      }
    });

    expect(wrapperPink.element.style.background).toBe('rgb(242, 222, 222)');
    expect(wrapperBlue.element.style.background).toBe('rgb(217, 237, 247)');
  });
});