module.exports = (sequelize, Sequelize) => {
	const Bus_schedule = sequelize.define(
		"bus_schedule",
		{
			id: {
				type: Sequelize.INTEGER(20).UNSIGNED,
				primaryKey: true,
				autoIncrement: true,
			},

			route_id: {
				type: Sequelize.INTEGER(20).UNSIGNED,
			},
			price: {
				type: Sequelize.DOUBLE,
			},
			time_from: {
				// Departure time of bus schedule
				// Format data: (giờ phút)
				// Ex: 13.5 (bus schedule start at 13h30)
				type: Sequelize.DOUBLE,
			},
			departure_location_id: {
				type: Sequelize.INTEGER(20).UNSIGNED,
			},
			arrive_location_id: {
				type: Sequelize.INTEGER(20).UNSIGNED,
			},
			travel_time: {
				// Time need for bus to complete bus schedule
				// Format data: int (số giờ)
				// Ex: 10 (meaning that bus need 10 hours to travel from start location to end location)
				type: Sequelize.DOUBLE,
			},
			// effective_start_date: {
			//   // The date the bus schedule start operating
			//   // Format date: date (ngày tháng)
			//   // Ex: September 9th (meaning that bus schedule will start working and be booked from September 9th)
			//   type: Sequelize.DATE,
			// },

			effective_date: {
				// The date the bus schedule start operating
				// Format date: date (ngày tháng)
				// Ex: September 9th (meaning that bus schedule will start working and be booked from September 9th)
				type: Sequelize.DATE,
			},
			refresh_date: {
				type: Sequelize.DATE,
			},
			bus_schedule_status: {
				type: Sequelize.INTEGER(2),
			},
			schedule_frequency: {
				type: Sequelize.INTEGER(20),
			},
			bus_schedule_expire: {
				type: Sequelize.INTEGER(20),
			},
		},
		{
			timestamps: false,
			freezeTableName: true,
		},
	);

	return Bus_schedule;
};
