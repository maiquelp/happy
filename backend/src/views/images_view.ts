import Image from '../models/Image';

export default {
  render(image: Image) {
    return {
      id: image.id,
      //url: `http://localhost:3333/uploads/${image.path}` //replace with env var, see .env
      url: `http://192.168.0.121:3333/uploads/${image.path}` //replace with env var, see .env
    }
  },

  renderMany(images: Image[]) {
    return images.map(element => this.render(element));
  }
}
