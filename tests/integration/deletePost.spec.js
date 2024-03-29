const { resolve } = require('path');

require('dotenv/config');
const axios = require('axios');

const rootDir = resolve('.');

const { sequelize } = require(`${rootDir}/src/models`);
const seedBlogPosts = require(`${rootDir}/src/seeders/20200812194353-BlogPosts.js`);

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;
const baseUrl = `http://${host}:${port}`;

describe('Test the DELETE /post/:id endpoint', () => {
  beforeEach(async () => {
    await seedBlogPosts.down(sequelize.queryInterface);
    await seedBlogPosts.up(sequelize.queryInterface);
  });

  afterAll(() => sequelize.close());

  it('user 3 is able to delete his own posts', async () => {
    const userData = { email: 'MichaelSchumacher@gmail.com', password: '123456' };
    const { data: login } = await axios.post(`${baseUrl}/login`, userData);

    const { token: authorization } = login;
    const config = {
      timeout: 1000,
      headers: { authorization },
    };
    const { data, status } = await axios.delete(`${baseUrl}/post/2`, config);

    expect(status).toBe(204);
    expect(data).toBeFalsy();
  });

  it('user 2 is not allowed to delete user 3’s posts', async () => {
    const userData = { email: 'lewishamilton@gmail.com', password: '123456' };
    const { data: login } = await axios.post(`${baseUrl}/login`, userData);

    const { token: authorization } = login;
    const config = {
      timeout: 1000,
      headers: { authorization },
    };
    const { data, status } = await axios.delete(`${baseUrl}/post/2`, config)
      .catch(({ response }) => ({ data: response.data, status: response.status }));

    expect(status).toBe(401);
    expect(data.message).toBe('Unauthorized user');
  });
});
