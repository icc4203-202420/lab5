require 'sinatra/base'
require 'sinatra/cross_origin'
require 'sinatra/json'
require 'sinatra/reloader'

require_relative 'markers'

class Backend < Sinatra::Base
  set :json_content_type, :json

  before do
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  configure do
    enable :cross_origin
  end

  options '*' do
    response.headers['Allow'] = 'HEAD,GET,POST,PUT,PATCH,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'HEAD,GET,POST,PUT,PATCH,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Accept'
    200
  end

  get '/markers' do
    MARKERS.to_json
  end

  run! if app_file == $0
end
