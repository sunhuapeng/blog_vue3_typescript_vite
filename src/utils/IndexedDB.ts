
/**
 * @desc indexdb的增删改查
 */
export default class Idb {
  public request: any | undefined
  public db: any | undefined
  public name: string | undefined
  public indexDBName: string
  constructor(indexDBName: string) { 
    this.indexDBName = indexDBName
   }
  // 打开数据库
  init() {
    return new Promise((resolve, reject) => {
      this.request = window.indexedDB.open(this.indexDBName);
      this.request.onerror = (error: any) => {
        reject(error)
      };
      this.request.onsuccess = () => {
        this.db = this.request.result;
        resolve('OK')
      };
      this.request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        let objectStore: any | undefined;
        if (!this.db.objectStoreNames.contains(this.indexDBName)) {
          objectStore = this.db.createObjectStore(this.indexDBName, {
            keyPath: "ID"
          }); // 主键自增
        }
      };

    })
  }

  // onupgradeneeded(event)
  // 添加
  setItem(ID: string, json: any) {
    return new Promise((resolve, reject) => {
      // this.name = name;
      // let strScene: string = JSON.stringify(json);
      let object = {
        ID,
        ...json
      };

      var request = this.db
        .transaction([this.indexDBName], "readwrite")
        .objectStore(this.indexDBName)
        .add(object);

      request.onsuccess = (event: any) => {
        resolve('OK')
      };

      request.onerror = (error: any) => {
        reject(error)
      };
    })
  }
  // 读取
  getItem(ID: string) {
    return new Promise((resolve, reject) => {
      var transaction: any = this.db.transaction([this.indexDBName]);
      var objectStore: any = transaction.objectStore(this.indexDBName);
      var request: any = objectStore.get(ID);
      request.onerror = (error: any) => {
        reject(error)
      };

      request.onsuccess = (error: any) => {
        if (request.result) {
          resolve(request.result)
        } else {
          reject(error)
        }
      };
    })
  }
  // 更新
  updateItem(ID: string, json: any) {
    return new Promise<void>((resolve, reject) => {
      var request = this.db.transaction([this.indexDBName], 'readwrite')
        .objectStore(this.indexDBName)
        .put({
          ID,
          ...json
        });

      request.onsuccess = function (event: any) {
        resolve(event);
      };

      request.onerror = function (error: any) {
        reject(error)
      }
    })
  }
  // 删除项
  removeItem(ID: string) {
    return new Promise((resolve, reject) => {
      var request: any = this.db
        .transaction(["scene"], "readwrite")
        .objectStore("scene")
        .delete(ID);
  
      request.onsuccess = function (event:any): void {
        resolve(event)
       };
      request.onerror = function (error:any): void {
        reject(error)
       };
    })
  }
  // 删除全部
  removeAll() {
    return new Promise((resolve, reject) => {
      var objectStore = this.db.transaction(this.indexDBName).objectStore(this.indexDBName);
      objectStore.openCursor().onsuccess = (event: any) => {
        var cursor = event.target.result;
        if (cursor) {
          cursor.continue();
          this.removeItem(cursor.key);
        } else {
          resolve("全部删除成功");
        }
      };
    })
  }
}
