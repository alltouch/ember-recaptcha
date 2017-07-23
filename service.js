import Service from 'ember-service';
import Evented from 'ember-evented';
import runloop from 'ember-runloop';
import config from '../config/environment';

export default Service.extend(Evented, {
  callBackName: 'captchCallback',
  loaded: false,

  addScript(){
    let callBackName = this.get('callBackName');
    let s = document.createElement('script');
    s.src = `//www.google.com/recaptcha/api.js?onload=${callBackName}&render=explicit`;
    document.head.appendChild(s);
  },
  addCallBack(){
    let callBackName = this.get('callBackName');
    window[callBackName] = () => runloop(this, 'removeCallBack');
  },
  removeCallBack(){
    this.set('loaded', true);
    this.trigger('loaded');
    let callBackName = this.get('callBackName');
    window[callBackName] = undefined;
  },
  show(el){
    if(this.get('loaded')){
      this.render(el);
    } else {
      this.addCallBack();
      this.addScript();
      this.one('loaded', this, () => this.render(el));
    }
  },
  render(el){
    window.grecaptcha.render(el,{
      sitekey: config.APP.RECAPTCHA_SITEKEY
    });
  }
});
