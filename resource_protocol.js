class Resource {
  constructor() {
    this._id = "";
  }

  static genUUID(oriThirdPartyId) {}

  static getIdByUUID() {}

  static getUUIDById() {}
}

class DoubanNoteResource extends Resource {
  constructor() {
    super();
  }

  static get ["UUID_PREF"]() {
    return "https://douban.com/note/";
  }

  static genUUID(oriThirdPartyId) {
    return `${DoubanNoteResource.UUID_PREF}${oriThirdPartyId}`;
  }

  static getOriginalThirdPartyId(UUID) {
    return UUID.split(DoubanNoteResource.UUID_PREF)[1];
  }

  static getIdByUUID(UUID) {
    return UUID;
  }

  static getUUIDById(ID) {
    return ID;
  }
}
