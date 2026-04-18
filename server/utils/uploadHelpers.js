// 集中資料夾映射可避免多路由各自維護導致上傳路徑不一致
const getFolderName = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  return 'files';
};

module.exports = { getFolderName };
