import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from '../createRelayEnvironment'
import {ConnectionHandler} from 'relay-runtime'

const mutation = graphql`
  mutation UpdatePostMutation($input: UpdatePostInput!) {
    updatePost(input: $input) {
      post {
        id
        description
        imageUrl
      }
    }
  }
`;

let tempID = 0;

export default function UpdatePostMutation(description, imageUrl, viewerId, callback) {
  const variables = {
    input: {
      clientMutationId: new Buffer(Date.now().toString(), 'utf8').toString('base64'),
      description,
      imageUrl,
      id: viewerId
    },
  }
  console.log("variables", variables)
  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response) => {
        console.log(response, environment)
        callback()
      },
      onError: err => console.error(err),
      optimisticUpdater: (proxyStore) => {
        // TODO for update.
        // // 1 - create the `newPost` as a mock that can be added to the store
        // const id = clientMutationId
        // const newPost = proxyStore.create(id, 'Post')
        // newPost.setValue(id, 'id')
        // newPost.setValue(description, 'description')
        // newPost.setValue(imageUrl, 'imageUrl')*/

        // // 2 - add `newPost` to the store
        // const viewerProxy = proxyStore.get(viewerId)
        // const connection = ConnectionHandler.getConnection(viewerProxy, 'ListPage_allPosts')
        // if (connection) {
        //   ConnectionHandler.insertEdgeAfter(connection, newPost)
        // }
      },
      updater: (proxyStore) => {
        // 1 - retrieve the `newPost` from the server response
        const createPostField = proxyStore.getRootField('updatePost')
        const newPost = createPostField.getLinkedRecord('post')

        // 2 - add `newPost` to the store
        const viewerProxy = proxyStore.get(viewerId)
        const connection = ConnectionHandler.getConnection(viewerProxy, 'ListPage_allPosts')
        if (connection) {
          ConnectionHandler.insertEdgeAfter(connection, newPost)
        }
      },
    },
  )
}
