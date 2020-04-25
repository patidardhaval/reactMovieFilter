import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BottomScrollListener from 'react-bottom-scroll-listener'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      movieList: [],
      genreList: [],
      selected_genre: '',
      page: 1
    };

    this.handleChange = this.handleChange.bind(this);
  }

  

  componentDidMount() {
    
    this.filter('')

    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=f0218cb368232fc7b7ce7c10c724a25b")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            genreList: result.genres
          });
        },

        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleChange(event) {
    this.setState({ selected_genre: event.target.value });
    let target = event.target.value;
    this.setState({
      page:1,
      movieList : []
    },() => {
      this.filter(target,1);
    })
  }


  filter(gen,page=1) {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=f0218cb368232fc7b7ce7c10c724a25b&sort_by=popularity.desc&with_genres="+gen+"&page="+page  
    )
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            isLoaded: true,
            movieList: [...this.state.movieList,...result.results]
          });
        },

    (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }



  handleContainerOnBottom=()=>{
    this.setState({
      page:this.state.page+1
    }, () => {
      this.filter(this.state.selected_genre,this.state.page)
    })

  }


  render() {
    const { error, isLoaded, movieList, genreList } = this.state;
    const baseurl_image = "https://image.tmdb.org/t/p/w342";
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <main className="row" >
          
          <div className="col-md-12 d-inline-block m-1" onScroll={this.handleScroll} id="header">
            <strong>Order By  </strong>
            <select className="dropdown-list"><option>Popularity</option></select>

            <strong> Filter By: </strong>
            <select   onChange={this.handleChange} value={this.state.selected_genre}>
              <option value=''>All Generes</option>
              {
                genreList.map((v, k) => (
                  <option key={k} value={v.id}>{v.name}</option>
                ))}
            </select>

            

          </div>

          <BottomScrollListener onBottom={this.handleContainerOnBottom}>
            {movieList.map((v, k) => (
              <div key={k} className="card col-md-2" style={{ maxWidth: '229px', margin: '7px' }}>
                <img className="card-img-top" src={baseurl_image + v.poster_path} alt="Card cap" />
                <div className="card-body">
                  <h6 className="card-title">{v.original_title} </h6>
                </div>

              </div>
            ))}
          </BottomScrollListener>

          
        </main>
      );
    }
  }
}

export default App;
