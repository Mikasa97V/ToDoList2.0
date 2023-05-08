function switchStorage() {
  let switchStorageBtn = document.querySelector('.switch-storage');
  let storageType = localStorage.getItem('storageType')
  if(!storageType) {
    localStorage.setItem('storageType', 'local')
    switchStorageBtn.textContent = "Перейти на серверное хранилище"
  } else {
    if (storageType === 'local') {
      switchStorageBtn.textContent = "Перейти на серверное хранилище";
    } else {
      switchStorageBtn.textContent = "Перейти на локальное хранилище";
    }
  }


  switchStorageBtn.addEventListener('click', () => {
    storageType = localStorage.getItem('storageType')
    if (storageType && storageType === 'local') {
      switchStorageBtn.textContent = "Перейти на локальное хранилище";
      localStorage.setItem('storageType', 'server')
    } else {
      switchStorageBtn.textContent = "Перейти на серверное хранилище";
      localStorage.setItem('storageType', 'local')
    }

  })


}

export { switchStorage }


