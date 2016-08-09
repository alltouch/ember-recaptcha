import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
    callBackName: 'captchCallback',
    loaded: false,

    addScript(){
        let callBackName = this.get('callBackName');
        var s = document.createElement('script');
        s.src = `//www.google.com/recaptcha/api.js?onload=${callBackName}&render=explicit`;
        document.head.appendChild(s);
    },
    addCallBack(){
        let callBackName = this.get('callBackName');
        window[callBackName] = () => Ember.run(this, 'removeCallBack');
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
            sitekey: 'key'
        });
    }
});
