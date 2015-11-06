// export { default } from 'ember-local-storage/adapters/adapter';

import DS from 'ember-data';
import Store from 'npm:pouchdb-hoodie-store';
import randomString from 'npm:random-string';
import humbleLocalStorage from 'npm:humble-localstorage';

var storeId = humbleLocalStorage.getItem('storeId')
if (!storeId) {
  storeId = 'store-' + randomString({length: 7}).toLowerCase()
  humbleLocalStorage.setItem('storeId', storeId)
}


var hoodieStore = window.hoodieStore = new Store(storeId, {
  remote: '/api'
})

export default DS.Adapter.extend({
    findRecord(store, type, id) {
      return hoodieStore.find(id).then(toJsonApi)
    },
    createRecord(store, type, snapshot) {
      let serialized = this.serialize(snapshot);
      let record = {
        type: type.modelName,
        title: serialized.data.attributes.title
      };

      return hoodieStore.add(record).then(toJsonApi)
    },
    updateRecord() {
      return Promise.reject(new Error('not yet implemented'))
    },
    deleteRecord(store, type, snapshot) {
      let serialized = this.serialize(snapshot, { includeId: true});
      let id = snapshot.id;
      return hoodieStore.remove(id).then(toJsonApi)
    },
    findAll() {
      return hoodieStore.findAll().then(toJsonApi)
    },
    query() {
      return Promise.reject(new Error('not yet implemented'))
    }
});

function toJsonApi(data) {
  if (!Array.isArray(data)) {
    return { data: toJsonApiRecord(data) }
  }

  return {
    data: data.map(toJsonApiRecord)
  }
}

function toJsonApiRecord(record) {
  return {
    id: record.id,
    type: record.type,
    attributes: {
      title: record.title
    }
  }
}

function toHoodieData(data) {

}
