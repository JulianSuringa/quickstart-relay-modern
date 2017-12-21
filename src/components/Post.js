import React from 'react'
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {Link, withRouter } from 'react-router-dom';
import DeletePostMutation from '../mutations/DeletePostMutation';
import UpdatePostMutation from '../mutations/UpdatePostMutation';

class Post extends React.Component {

  render () {
    console.log("sdfsf", this.props)
    return (
      <div className='pa3 bg-black-05 ma3'>
        <div
          className='w-100'
          style={{
            backgroundImage: `url(${this.props.post.imageUrl})`,
            backgroundSize: 'cover',
            paddingBottom: '100%',
          }}
        />
        <div className='pt3'>
          {this.props.post.description}&nbsp;
          <span
            style={{'float': 'right'}}
            className='f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-red'
            onClick={this._handleDelete}
          >Delete</span>
          <Link to={{
              pathname: `/update/${this.props.post.id}`,
              state: { ...this.props.post }
            }}
             style={{'float': 'right', 'marginRight': '5px'}}
            className='f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-blue'>
            Update
          </Link>
        </div>
      </div>
    )
  }

  _handleDelete = () => {
    DeletePostMutation(this.props.post.id, this.props.viewer.id)
  }
}

const FragmentContainer =  createFragmentContainer(Post, graphql`
  fragment Post_viewer on Viewer {
    id
  }
  fragment Post_post on Post {
    id
    description
    imageUrl
  }
`)

export default withRouter(FragmentContainer);