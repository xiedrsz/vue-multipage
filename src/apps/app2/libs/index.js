// 睡眠
export const sleep = s => {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      resolve('promise resolved')
      // reject(false)
    }, s)
  })
}
