import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

/*
 * The authorization header is set for axios when you login but what happens when you come back or
 * the page is refreshed. When that happens you need to check for the token in local storage and if it
 * exists you should set the header so that it will be attached to each request
 */
const currentToken = localStorage.getItem('token')
const currentUser = JSON.parse(localStorage.getItem('user'));

if (currentToken != null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

export default new Vuex.Store({
  state: {
    token: currentToken || '',
    user: currentUser || {},
    favoritesList: [],
    approvedRestaurants: [], //thumbs-up restaurants
    rejectedRestaurants: [], //thumbs-down restaurants
    restaurants: [],
    pendingInvites:[], 
    inviteeLinks: [],
    invitees: [],
    yesList: [],
    id:0,
    eventRestaurant: {
      yelpRestaurantId: '',
      eventId: 0,
      voteCount: 0
    }
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    LOGOUT(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = '';
      state.user = {};
      axios.defaults.headers.common = {};
      state.restaurants = [];
      state.approvedRestaurants = [];
      state.rejectedRestaurants = [];
    },
    ADD_RESTAURANTS(state, eventRestaurant) {
      state.restaurants.push(eventRestaurant);
    },
    ADD_FAVORITES_LIST(state, favoritesList) {
      state.favoritesList = favoritesList; //unsure if i "push" it into the list or do i just keep as the way it is written
    },
    //capturing new invite.
    SET_PENDING_INVITE(state, data) {
      state.pendingInvite = data;
    },
    ADD_TO_YES_LIST(state, id) {
      let temporaryYesList = state.approvedRestaurants.filter( (approvedBusiness) => {
          return id != approvedBusiness;
      });
      let temporaryNoList = state.rejectedRestaurants.filter( (rejectedBusiness) => {
          return id != rejectedBusiness;
      });
      state.approvedRestaurants = temporaryYesList;
      state.rejectedRestaurants = temporaryNoList;
      state.approvedRestaurants.push(id);
    },
    ADD_TO_NO_LIST(state, id) {
    let temporaryYesList = state.approvedRestaurants.filter( (approvedBusiness) => {
      return id != approvedBusiness;
    });
    let temporaryNoList = state.rejectedRestaurants.filter( (rejectedBusiness) => {
      return id != rejectedBusiness;
    });
    state.approvedRestaurants = temporaryYesList;
    state.rejectedRestaurants = temporaryNoList;
    state.rejectedRestaurants.push(id);
    }
  }
})
