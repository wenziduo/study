(function () {
  function ModalPlugin(options) {
    return new init(options)
  }
  function init(options) {
    options = Object.assign({
      title: '系统提示',
      content: 'xxxxxxxxxxxxx',
      buttons: [],
    }, options)
    this.options = options
    // 事件池
    this.pond = {
      init: [],
      close: [],
      open: []
    };
    this.init();
  }

  ModalPlugin.prototype = {
    constractor: ModalPlugin,
    init() {
      this.createDOM()
      // 添加事件、
      this.modalOuterNode.addEventListener('click', ev => {
        const tagName = ev.target.tagName
        console.log('tagName', tagName)
        const className = ev.target.className
        if (tagName === 'SPAN' && className.includes('modal-position-closeX')) {
          this.close.call(this)
          return
        }
        if (tagName === 'BUTTON' && className.includes('modal-footer-button')) {
          const arr = this.options.buttons
          const index = ev.target.getAttribute('index')
          const currFun = arr[index].onClick;
          if (typeof currFun === 'function') {
            currFun.call(this)
            if (arr[index].close) {
              this.close()
            }
          }
        }
      })
    },
    createDOM() {
      let frag = document.createDocumentFragment();
      let modalOuter = document.createElement('div');
      modalOuter.className = 'modal-outer'
      modalOuter.innerHTML = `
      <div class="modal-position">
        <span class="modal-position-closeX">X</span>
      </div>
      <div class="modal-header">
        <span>${this.options.title}</span>
      </div>
      <div class="modal-content">
        <span>${this.options.content}</span>
      </div>
      <div class="modal-footer">
        ${
        this.options.buttons.map((ele, index) => `<button class="modal-footer-button" index="${index}">${ele.text}</button>`).join('')
        }
      </div>
      `
      frag.appendChild(modalOuter)
      let modalMask = document.createElement('div');
      modalMask.className = 'modal-mask'
      frag.appendChild(modalMask)
      document.body.appendChild(frag)
      frag = null;
      this.modalOuterNode = modalOuter;
      this.modalMaskNode = modalMask;
    },
    open() {
      this.modalOuterNode.style.display = 'block'
      this.modalMaskNode.style.display = 'block'
      this.fire('open')
    },
    close() {
      this.modalOuterNode.style.display = 'none'
      this.modalMaskNode.style.display = 'none'
      this.fire('close')
    },
    // 用于订阅
    on(type, func) {
      const events = this.pond[type];
      if (events.includes(func)) return;
      events.push(func);
    },
    fire(type) {
      const events = this.pond[type]
      events.forEach(currentFun => {
        if (typeof currentFun === 'function') {
          currentFun()
        }
      });
    },
  }
  init.prototype = ModalPlugin.prototype
  window.ModalPlugin = ModalPlugin;
})()