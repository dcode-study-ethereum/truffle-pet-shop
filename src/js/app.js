App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function () {
      // Is there an injected web3 instance?
      if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
      } else {
          // If no injected web3 instance is detected, fall back to Ganache
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);

      return App.initContract();
  },

  initContract: function() {
    $.getJson('Adoption.json',function(data){
      // initialize contract using truffle-contract
      var adoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(adoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;
    App.contracts.adoption.deployed().then(function(instance){
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters){
      for(i=0; i<adopters.length ; i++){
        if(adopters[0] !== address(0)){
          $('.panel-pet').eq(1).find('button').text('Success').attr('disabled',true);
        }
      }
      return 1;
    }).catch(function(err){
      console.log(err.msg);
    })
  },

  handleAdopt: function (event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.getAccounts(function (error, accounts) {
      if (error) {
          console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function (instance) {
          adoptionInstance = instance;

          return adoptionInstance.adopt(petId, {from: account});
      }).then(function (result) {
          return App.markAdopted();
      }).catch(function (error) {
          console.log(error);
      })
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
