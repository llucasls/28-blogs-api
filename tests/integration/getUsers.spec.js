const { resolve } = require('path');

require('dotenv/config');
const axios = require('axios');

const rootDir = resolve('.');

const login = require(`${rootDir}/tasks/login`);

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;
const baseUrl = `http://${host}:${port}`;

describe('Test the GET /user endpoint', () => {
  beforeAll(login);

  it('return data on registered users', async () => {
    const { authorization } = process.env;
    const config = {
      timeout: 1000,
      headers: { authorization },
    };
    const { data, status } = await axios.get(`${baseUrl}/user`, config);
    const [_, hamilton, schumacher] = data;
    expect(status).toBe(200);
    expect(hamilton).toEqual({
      displayName: 'Lewis Hamilton',
      email: 'lewishamilton@gmail.com',
      id: 2,
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg',
    });
    expect(schumacher).toEqual({
      id: 3,
      displayName: 'Michael Schumacher',
      email: 'MichaelSchumacher@gmail.com',
      image: 'https://sportbuzz.uol.com.br/media/_versions/gettyimages-52491565_widelg.jpg',
    });
  });

  it('doesn’t return users list without authorization token', async () => {
    const { data, status } = await axios.get(`${baseUrl}/user`)
      .catch(({ response }) => ({ data: response.data, status: response.status }));
    expect(status).toBe(401);
    expect(data).toEqual({ message: 'Token not found' });
  });
});
