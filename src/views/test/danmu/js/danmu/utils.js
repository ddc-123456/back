function isObject(value) {
  const type = Object.prototype.toString.call(value);
  return type === '[object Object]';
}

function isArray(value) {
  return Array.isArray(value);
}

function getTextWidth(content, fontSize) {

  //创建临时元素
  const _span = document.createElement('span');
  //放入弹幕文本
  _span.innerText = content;
  //设置文本字体大小
  _span.style.fontSize = `${fontSize}px`;
  //span转为块级
  _span.style.position = 'absolute';
  //span放入body中
  document.body.appendChild(_span);
  //获取span的宽度
  let width = _span.offsetWidth;
  //从body上删除span
  document.body.removeChild(_span);
  //返回宽度
  return width;
}

function getTextPosition(canvas, fontSize, ctx) {
  let
    X = canvas.width,
    Y = canvas.height * Math.random()

  Y < fontSize && (Y = fontSize);
  Y > canvas.height - fontSize && (Y = canvas.height - fontSize);

  ctx.X = X;
  ctx.Y = Y;
}

export {
  isObject,
  isArray,
  getTextWidth,
  getTextPosition
}