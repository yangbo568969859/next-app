import siteNavigation from '@/navigation.json' assert { type: 'json' };

const findIdInNestedArray = (nestedArray: any, id: string): any => {
  for (let i = 0; i < nestedArray.length; i++) {
    if (nestedArray[i].link === id) {
      return nestedArray[i]
    }
    if (Array.isArray(nestedArray[i].children)) {
      // @ts-ignore
      const result = findIdInNestedArray(nestedArray[i].children, id);
      if (result) {
        return result;
      }
    }
  }
  return null
}

const getContentTreeItems = async (key: string = '') => {
  if (key === '' || key === null || key === undefined) {
    return siteNavigation
  }
  let result
  if (siteNavigation.length) {
    result = findIdInNestedArray(siteNavigation, key)
  }
  if (result) {
    return result
  }
  return null;
}

const depget = (nestedArray: any, id: string) => {
  for (let i = 0; i < nestedArray.length; i++) {
    if (nestedArray[i].link === id) {
      return nestedArray;
    }
    if (Array.isArray(nestedArray[i].children)) {
      const result: any = depget(nestedArray[i].children, id);
      if (result) {
        return result;
      }
    }
  }
}
const getMenusByPath = async (key: string = '') => {
  // console.log(key)
  if (siteNavigation.length) {
    let result
    result = depget(siteNavigation, `/${key}`)
    // console.log('getMenusByPath', result);
    return result;
  }
  return null;
}

export {
  getContentTreeItems,
  getMenusByPath
}