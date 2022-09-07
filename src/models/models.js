const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING },
	name:  { type: DataTypes.STRING },
  // role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Role = sequelize.define('role', {
	id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
})

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  text: { type: DataTypes.STRING, },
});

const Company = sequelize.define('company', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  fullname: { type: DataTypes.STRING },
  logo: { type: DataTypes.STRING },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  description: { type: DataTypes.STRING },
});

const CompanyInfo = sequelize.define('company_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  main_office_address: { type: DataTypes.STRING },
  call_center_phone: { type: DataTypes.STRING },
});

const CompanyRating = sequelize.define('company_rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const Route = sequelize.define('route', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  start_time: { type: DataTypes.TIME },
  end_time: { type: DataTypes.TIME },
  price: { type: DataTypes.DECIMAL(10, 2) },
  distance: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING },
});

const City = sequelize.define('city', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
});

const Province = sequelize.define('province', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
});

const StartCity = sequelize.define('start_city', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const EndCity = sequelize.define('end_city', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const ViaCity = sequelize.define('via_city', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BusStop = sequelize.define('bus_stop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  address: { type: DataTypes.STRING },
  geopoint: { type: DataTypes.STRING, unique: true },
  description: { type: DataTypes.STRING },
});

const StopType = sequelize.define('stop_type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
});

const StartTerminal = sequelize.define('start_terminal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const EndTerminal = sequelize.define('end_terminal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BusInfo = sequelize.define('bus_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bus_img: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});

const BusType = sequelize.define('bus_type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type_name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const BusBrand = sequelize.define('bus_brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand_name: { type: DataTypes.STRING, unique: true, allowNull: false },
  model: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
});

const BusService = sequelize.define('bus_service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  service_icon: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});

const ROLES = ["user", "admin", "moderator"];

Role.belongsToMany(User, {
  through: "user_role",
  foreignKey: "roleId",
  otherKey: "userId"
});

User.belongsToMany(Role, {
  through: "user_role",
  foreignKey: "userId",
  otherKey: "roleId"
});

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(CompanyRating);
CompanyRating.belongsTo(User);

Company.hasMany(
  Route
  // { foreignKey: 'startCityId',}
);
Route.belongsTo(Company);

Company.hasMany(CompanyInfo);
CompanyInfo.belongsTo(Company);

Company.hasMany(CompanyRating);
CompanyRating.belongsTo(Company);

Province.hasMany(City, {
  foreignKey: 'provinceId',
});
City.belongsTo(Province, {
  foreignKey: 'provinceId',
});

City.hasMany(StartCity, {
  foreignKey: 'cityId',
});
StartCity.belongsTo(City, {
  foreignKey: 'cityId',
});

City.hasMany(EndCity, {
  foreignKey: 'cityId',
});
EndCity.belongsTo(City, {
  foreignKey: 'cityId',
});

City.hasMany(ViaCity);
ViaCity.belongsTo(City);

City.hasMany(BusStop);
BusStop.belongsTo(City);

StopType.hasMany(BusStop);
BusStop.belongsTo(StopType);

BusStop.hasMany(StartTerminal);
StartTerminal.belongsTo(BusStop);

BusStop.hasMany(EndTerminal);
EndTerminal.belongsTo(BusStop);

StartTerminal.hasMany(Route);
Route.belongsTo(StartTerminal);

EndTerminal.hasMany(Route);
Route.belongsTo(EndTerminal);

StartCity.hasMany(Route, {
  foreignKey: 'startCityId',
});
Route.belongsTo(StartCity, {
  foreignKey: 'startCityId',
});

EndCity.hasMany(Route, {
  foreignKey: 'endCityId',
});
Route.belongsTo(EndCity, {
  foreignKey: 'endCityId',
});

ViaCity.hasMany(Route);
Route.belongsTo(ViaCity);

BusInfo.hasMany(Route);
Route.belongsTo(BusInfo);

BusBrand.hasMany(BusInfo);
BusInfo.belongsTo(BusBrand);

BusType.hasMany(BusInfo);
BusInfo.belongsTo(BusType);

BusService.hasMany(BusInfo);
BusInfo.belongsTo(BusService);

module.exports = {
  User,
	Role,
  Comment,
  Company,
  CompanyInfo,
  CompanyRating,
  Route,
  City,
  Province,
  StartCity,
  EndCity,
  ViaCity,
  BusStop,
  StopType,
  StartTerminal,
  EndTerminal,
  BusInfo,
  BusType,
  BusBrand,
  BusService,
};
