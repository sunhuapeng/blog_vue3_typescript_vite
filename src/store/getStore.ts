const getVuexFile = async function (m: any) {
  const modules = import.meta.glob('./modules/*.ts')

  for (const path in modules) {
    await modules[path]().then((mod) => {
      Object.assign(m,mod)
    })
  }
}
export default getVuexFile