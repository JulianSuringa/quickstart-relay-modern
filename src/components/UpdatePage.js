import React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import environment from '../createRelayEnvironment'
import { withRouter, Link } from 'react-router-dom'
import UpdatePostMutation from '../mutations/UpdatePostMutation'

const UpdatePageViewerQuery = graphql.experimental`
  query UpdatePageViewerQuery($id: ID!) {
    viewer {
      Post(id: $id) {
        id
        imageUrl
        description
      }
    }
  }
`;

class UpdatePage extends React.Component {

  state = {
    description: '',
    imageUrl: '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading) return
    this.setState({
      description: this.props.viewer.Post.description,
      imageUrl: this.props.viewer.Post.description,
    })
  }

  render () {
    console.log(this.props)
    return (
      <QueryRenderer
        environment={environment}
        query={UpdatePageViewerQuery}
        variables={{id: this.props.match.params.id}}
        render={({error, props}) => {

          if (error) {
            return (
              <div>{error.message}</div>
            )
          } else if (props) {


            return (
              <div className='w-100 pa4 flex justify-center'>
                <div style={{ maxWidth: 400 }} className=''>
                  <input
                    className='w-100 pa3 mv2'
                    value={this.state.description || props.viewer.Post.description}
                    placeholder='Description'
                    onChange={(e) => this.setState({description: e.target.value})}
                  />
                  <input
                    className='w-100 pa3 mv2'
                    value={this.state.imageUrl || props.viewer.Post.imageUrl}
                    placeholder='Image Url'
                    onChange={(e) => this.setState({imageUrl: e.target.value})}
                  />

                  <img
                    src={this.state.imageUrl || props.viewer.Post.imageUrl}
                    alt={this.state.description || props.viewer.Post.description}
                    className='w-100 pa3 mv2'
                  />
                  <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={() => this._handlePostUpdate(props.viewer.Post)}>Update</button>
                  <div style={{textAlign: "center", color: "red"}}>
                    <Link to="/" >Cancel</Link>
                  </div>
                </div>
              </div>
            )
          }
          return (<div>loading</div>)
        }}
      />
    )
  }

  _handlePostUpdate = (post) => {
    const {description, imageUrl} = this.state
    let description_update = description ? description : post.description;
    let imageUrl_update = imageUrl ? imageUrl : post.imageUrl;
    UpdatePostMutation(description_update, imageUrl_update, post.id,  () => this.props.history.replace('/'))
  }

}

export default withRouter(UpdatePage)