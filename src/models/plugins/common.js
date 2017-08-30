import jsonSelect from 'mongoose-json-select';

function CommonPlugin(Schema) {
  Schema.add({
    id: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    create_date: {
      type: Number,
      required: true
    },
    update_date: {
      type: Number,
      required: true
    }
  });

  Schema.pre('validate', function (next) { // eslint-disable-line func-names
    this.create_date = Date.parse(this._id.getTimestamp());
    this.update_date = Date.now();
    this.id = this._id.toString();
    next();
  });

  Schema.plugin(
    jsonSelect,
    ['_id', '__v'].map(field => `-${field}`).join(' ')
  );
  return Schema;
}

export default CommonPlugin;
