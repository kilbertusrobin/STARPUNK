import * as prismic from '@prismicio/client';

const repositoryName = 'starpunk';
const endpoint = prismic.getRepositoryEndpoint(repositoryName);
const accessToken = 'MC5aMzRfX2hFQUFDY0Fja05H.bClF77-977-9EktBT--_ve-_vQ1N77-9Y--_ve-_vS3vv73vv71W77-977-9WgoC77-977-9Lz5DLw'; // Ton token d'accès

export const client = prismic.createClient(endpoint, {
  accessToken: accessToken,
});
