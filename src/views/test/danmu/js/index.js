import VideoDanmu from "./danmu";

export default function initDanmu() {

  const danmuData = [
      {
        content: '郭子康郭子康郭子康',
        speed: 2,
        runTime: 0,
        color: 'red'
      }, {
        content: '郭子康郭子康郭子康',
        speed: 2,
        runTime: 3,
        color: 'blue'
      }, {
        content: '郭子康郭子康郭子康',
        speed: 2,
        runTime: 2,
        color: 'yellow'
      }, {
        content: '郭子康郭子康郭子康',
        speed: 4,
        runTime: 1,
        color: 'red'
      }, {
        content: '郭子康郭子康郭子康',
        speed: 2,
        runTime: 0,
        color: 'red'
      },
      {
        content: '郭子康郭子康郭子康',
        speed: 2,
        runTime: 5,
        color: 'green'
      },
      {
        content: '郭子康郭子康郭子康',
        speed: 4,
        runTime: 8,
        color: 'white'
      },
    ]

  ;((doc) => {

    //获取video canvas的DOM对象
    const
      oDanmuVideo = doc.getElementById('J_danmuVideo'),
      oDanmuCanvas = doc.getElementById('J_danmuCanvas'),
      oDanmuInput = doc.getElementById('J_danmuInput'),
      oDanmuButton = doc.getElementById('J_danmuButton'),
      oColorInput = doc.getElementById('color-input');


    const init = () => {

      //实例化弹幕插件
      window.videoDanmu = new VideoDanmu(
        oDanmuVideo,
        oDanmuCanvas,
        {
          danmuData
        }
      );

      bindEvent();
    }

    //绑定事件管理函数
    function bindEvent() {
      oDanmuVideo.addEventListener('play', handleVideoPlay, false);
      oDanmuVideo.addEventListener('pause', handleVideoPause, false);
      oDanmuVideo.addEventListener('seeked', handleVideoSeeked, false);
      oDanmuButton.addEventListener('click', handleDanmuBtuClick, false);
    }

    function handleVideoPlay() {
      videoDanmu.danmuPaused = false;
      videoDanmu.render();
    }

    function handleVideoPause() {
      videoDanmu.danmuPaused = true;
    }

    function handleVideoSeeked() {
      videoDanmu.reset();
    }

    function handleDanmuBtuClick() {
      // if (videoDanmu.danmuPaused) return;

      let inputValue = oDanmuInput.value.trim();

      if (!inputValue.length) return;

      const
        colorValue = oColorInput.value,
        currentTime = oDanmuVideo.currentTime;

      const _data = {
        content: inputValue,
        color: colorValue,
        runTime: currentTime
      };

      videoDanmu.addDanmu(_data);
      oDanmuInput.value = '';
    }

    init();
  })(document);
}
