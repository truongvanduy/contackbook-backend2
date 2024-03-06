const { ObjectId } = require('mongodb');
class ContactService {
  constructor(client) {
    this.Contact = client.db().collection('contacts');
  }

  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    return result;
  }

  async findFavorite() {
    return await this.find({ favorite: true });
  }

  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: 'after' }
    );
    return result;
  }

  async findById(id) {
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: 'i' },
    });
  }

  extractContactData(payload) {
    const { name, email, address, phone, favorite } = payload;
    const contact = {
      name,
      email,
      address,
      phone,
      favorite,
    };

    // Remove undefined fields
    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );

    return contact;
  }

  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      contact,
      {
        $set: {
          favorite: contact.favorite === true,
        },
      },
      { returnDocument: 'after', upsert: true }
    );

    return result;
  }
}

module.exports = ContactService;
