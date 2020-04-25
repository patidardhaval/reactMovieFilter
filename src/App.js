import React from 'react';
import {base_url,key,baseurl_image} from './config'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BottomScrollListener from 'react-bottom-scroll-listener'
import Navbar from './Layout/NavBar'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      movieList: [],
      genreList: [],
      selected_genre: '',
      genreArr: [],
      page: 1,
      clonemovieList: [],
      filter_rating: false,
      current_rate : ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.filterByRating = this.filterByRating.bind(this);
  }


  componentDidMount() {
    let url = base_url+"genre/movie/list?api_key="+key
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            genreList: result.genres
          }, () => {

          });

          this.filterMov(this.state.selected_genre,1)
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
      page: 1,
      movieList: []
    }, () => {
      this.filterMov(target, 1);
    })
  }

  handleClick(event) {
    const target = event.target;
    let tmpArr = [];
    this.setState({current_rate:'',filter_rating:false,clonemovieList:[]})
    if (target.checked) {
      target.removeAttribute('checked');
      target.parentNode.style.textDecoration = "";
      console.log("check", target.value)
      if (!this.state.genreArr.includes(target.value)) {

        tmpArr.push(target.value)
        this.setState(
          {
            movieList: [],
            genreArr: [...this.state.genreArr, ...tmpArr]
          },
          () => {
            let coma_str = this.state.genreArr.toString();
            this.setState({ selected_genre: coma_str });
            this.filterMov(coma_str, 1)
          }
        );

      }


    } else {
      target.setAttribute('checked', true);
      target.parentNode.style.textDecoration = "line-through";
      tmpArr = [...this.state.genreArr]; // make a separate copy of the array

      var index = tmpArr.indexOf(event.target.value)
      if (index !== -1) {
        tmpArr.splice(index, 1);
        let coma_str = tmpArr.toString();
        this.setState(
          {
            selected_genre: coma_str,
            movieList: [],
            genreArr: tmpArr
          },
          () => {

            this.filterMov(coma_str, 1)
          });
      }

    }


  }

  mapGenereToName = (id) => {
    return this.state.genreList.filter((v, k) => v.id === id);

  }

  filterMov(gen, page = 1) {
    let url = base_url + "discover/movie?api_key="+key+"&sort_by=popularity.desc&with_genres=" + gen + "&page=" + page;
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            isLoaded: true,
            movieList: [...this.state.movieList, ...result.results],
            page : this.state.page+1
          }, () => {

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

  handleContainerOnBottom = () => {
    if (!this.state.filter_rating) {
      this.filterMov(this.state.selected_genre, this.state.page)
    }

  }

  filterByRating(event) {

    if (event.target.value) {

      let filter_rating = [];
      
      if(this.state.clonemovieList.length>0){
        filter_rating = this.state.clonemovieList.filter((v, k) => v.vote_average > event.target.value);
      }else{
        filter_rating = this.state.movieList.filter((v, k) => v.vote_average > event.target.value);
      }

      this.setState({
        filter_rating: true,
        current_rate : event.target.value,
        clonemovieList: this.state.movieList,
        movieList: filter_rating
      })

    }
    else {
      this.setState({
        current_rate : '',
        filter_rating: false,
        movieList: this.state.clonemovieList
      }, () => {
        this.setState({
          clonemovieList : []
        })
      })
    }


  }

  render() {
    const { error, isLoaded, movieList, genreList, clonemovieList } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <main className="main-wrapper" >
          <Navbar />

          <div className="container">

            <div className="row">

              <div className="col-lg-3">
                <h4 className="my-4">Popularity</h4>
                <div className="select-style">
                <select className="dropdown-list"><option>Popularity</option></select>
                </div>

                <h4 className="my-4">Generes Search</h4>
                <div className="list-group">

                  <ul className="list-unstyled checkbox-list">
                    {
                      genreList.map((v, k) => (
                        <li key={k}>
                          <input type="checkbox" value={v.id} onClick={this.handleClick} />
                          <label className="ml-2"  value={v.id}>{v.name}</label>
                        </li>
                      ))
                    }
                  </ul>

                </div>
                <h4 className="my-4">Rating</h4>
                <div className="select-style">
                  <select  onChange={this.filterByRating} value={this.state.current_rate}>

                    <option value="">Any Rating</option>
                    <option value="0">0+ Star Rating</option>
                    <option value="0.5">0.5+ Star Rating</option>
                    <option value="1">1+ Star Rating</option>
                    <option value="1.5">1.5+ Star Rating</option>
                    <option value="2">2+ Star Rating</option>
                    <option value="2.5">2.5+ Star Rating</option>
                    <option value="3">3+ Star Rating</option>
                    <option value="3.5">3.5+ Star Rating</option>
                    <option value="4">4+ Star Rating</option>
                    <option value="4.5">4.5+ Star Rating</option>
                    <option value="5">5+ Star Rating</option>
                    <option value="5.5">4.5+ Star Rating</option>
                    <option value="6">6+ Star Rating</option>
                    <option value="6.5">6.5+ Star Rating</option>
                    <option value="7">7+ Star Rating</option>
                    <option value="7.5">7.5+ Star Rating</option>
                    <option value="8">8+ Star Rating</option>
                    <option value="8.5">8.5+ Star Rating</option>
                    <option value="9">9+ Star Rating</option>
                    <option value="9.5">9.5+ Star Rating</option>
                    <option value="10">10 Star Rating</option>

                  </select>
                </div>
              </div>
              <div className="col-lg-9 right-part">
                <div className="row my-3">
                  <BottomScrollListener onBottom={this.handleContainerOnBottom}>
                    {movieList.map((v, k) => (
                      <div key={k} className="col-md-3">
                        <div className="card">
                          <img className="card-img-top" src={baseurl_image + v.poster_path} alt="Card cap" />
                          <div className="card-body pl-0 pr-0">
                            <h6 className="card-title">{v.original_title} </h6>
                            <strong>Rating : </strong> <span>{v.vote_average}</span><br></br>
                            <strong>Generes List :</strong><br/>
                            {
                              
                              v.genre_ids.map((id) => (
                                this.mapGenereToName(id).map((val, index,arr) => (
                                  <React.Fragment>
                                    <span>{val.name}{','}</span>
                                  </React.Fragment>

                                ))
                              ))

                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </BottomScrollListener>
                </div>
              </div>
            </div>
          </div>
        </main>
      );
    }
  }
}

export default App;