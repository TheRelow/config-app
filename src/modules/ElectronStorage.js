const storage = require('electron-storage');

export async function getStorageInfo(file) {
  let returnData = 'something wrong';
  await storage.get(file)
    .then(data => {
      returnData = data
    })
    .catch(err => {
      returnData = err
    });
  return returnData
}
export function setStorageInfo(file, data) {
  storage.set(file, JSON.stringify(data))
    .then(() => {
      return {
        status: 'success',
        response: 'The file was successfully written to the storage'
      }
    })
    .catch(err => {
      return {
        status: 'error',
        response: err
      }
    })
}