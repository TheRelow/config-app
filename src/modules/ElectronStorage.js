const storage = require('electron-storage');

// eslint-disable-next-line no-unused-vars
function getStorageInfo(file) {
  storage.isPathExists(file)
    .then(itDoes => {
      if (itDoes) {
        storage.get(file)
          .then(data => {
            return {
              status: 'success',
              response: data
            }
          })
          .catch(err => {
            return {
              status: 'error',
              response: err
            }
          });
      } else {
        return {
          status: 'error',
          response: 'File does not exists'
        }
      }
    })
    .catch(err => {
      return {
        status: 'error',
        response: err
      }
    });
}

// eslint-disable-next-line no-unused-vars
function setStorageInfo(file, data) {
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