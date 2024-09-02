// 视频加载
const videoLoad = () => {
  const request = indexedDB.open("videoDB", 1);

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos", { keyPath: "id" });
    }
  };

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(["videos"], "readonly");
    const objectStore = transaction.objectStore("videos");
    const getRequest = objectStore.get("backgroundVideo");

    getRequest.onsuccess = function(event) {
      const videoData = event.target.result;

      if (videoData && window.localStorage.getItem('loadAttr') === 'video') {
        const videoElement = document.getElementById('backgroundVideo');
        if (videoData?.file) {
          const blob = new Blob([videoData.file], { type: 'text/plain' });
          // 创建一个 URL 对象
          const url = URL.createObjectURL(blob);
          videoElement.src = url;
          videoElement.style.display = 'block'
        }
      } else {
        console.log("没有上传视频.");
      }
    };

    getRequest.onerror = function() {
      console.log("检索背景出错.");
    };
  };

  request.onerror = function() {
    console.log("打开数据库出错.");
  };
}
// 图片加载
const imageLoad = () => {
  const request = indexedDB.open("imageDB", 1);

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("image")) {
      db.createObjectStore("image", { keyPath: "id" });
    }
  };

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(["image"], "readonly");
    const objectStore = transaction.objectStore("image");
    const getRequest = objectStore.get("backgroundImage");

    getRequest.onsuccess = function(event) {
      const imageData = event.target.result;

      if (imageData && window.localStorage.getItem('loadAttr') === 'image') {
        const imageElement = document.getElementById('backgroundImage');
        if (imageData?.file) {
          const blob = new Blob([imageData.file], { type: 'text/plain' });
          // 创建一个 URL 对象
          const url = URL.createObjectURL(blob);
          imageElement.src = url;
          videoElement.style.display = 'block'
        }
      } else {
        console.log("没有上传视频.");
      }
    };

    getRequest.onerror = function() {
      console.log("检索背景出错.");
    };
  };

  request.onerror = function() {
    console.log("打开数据库出错.");
  };
}
window.addEventListener('load', () => {
  videoLoad()
  imageLoad()
})
function throttle(fn, interval, options = { leading: true, trailing: false }) {
  const { leading, trailing } = options
  let lastTime = 0
  let timer = null
  const _throttle = function (...args) {
    const nowTime = new Date().getTime() //现在的时间
    if (lastTime === 0 && leading === false) {
      //如果我们的lastTime === 0  并且我们第一次决定不触发的时候 我们才会将lastTime 赋值nowTime
      lastTime = nowTime
    }
    //用现在的时间减去上一次执行后的时间 与 我们的时间间隔相比较 推出现在是否应该执行
    const remainTime = interval - (nowTime - lastTime)
    if (remainTime <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      fn.apply(this, ...args)
      lastTime = nowTime
      // 一旦我们这里开始执行之后 我们就没必要再在下面增加定时器了 如果增加会出现执行多次情况
      return
    }
    if (trailing && timer === null) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, ...args)
        // 为了避免我们我们leading为true的时候重复执行  我们这边必须将lastTime置为我们现在正在执行的时间
        lastTime = !leading ? 0 : new Date().getTime()
      }, remainTime)
    }
  }
  return _throttle
}
function searchFn() {
  const query = this.value;
  textValue = this.value;
  
  fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      const suggestions = data[1];
      const listEl = document.querySelector('.recommend-list')
      recommendList = suggestions
      
      if (suggestions.length !== 0) {
        listEl.style.display = 'block'
        document.querySelector('.search-box').style.borderRadius = '30px 30px 0 0' 
      }else{
        listEl.style = 'display: none;'
        document.querySelector('.search-box').style.borderRadius = '40px' 
      }
      if (suggestions.length !== 0) {
        listEl.innerHTML = ''
        const length = 40 * suggestions.length
        if (length >= 200) {
          listEl.style.height = 200 + 'px'
        }else{
          listEl.style.height = length + 'px'
        }
        suggestions.forEach(item => {
          const div = document.createElement('div')
          div.classList.add('lists')
          div.innerHTML = item
          div.addEventListener('click', () => {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(item)}`
          })
          listEl.appendChild(div)
        })
      }
    })
    .catch(error => console.error('Error fetching suggestions:', error));
}
document.querySelector('.search-txt').addEventListener('input', throttle(searchFn, 300, { leading: true, trailing: true }));
