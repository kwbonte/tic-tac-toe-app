This is an exploratory attempt at making a React app front end with a PostGresql backend leveraging express.

Goals of making a tic tac toe game that evaluates who wins and successfully does CRUD operations with a Postgresql db.

The db is designed to have a "games table" which keeps track of a game by id, the player name for x, player name for y, current turn, and the game status (complete, in_progress, draw)
game_id, player_x_name, player_y_name, current_turn, game_status
There will also be a "Moves table" which keeps track of a move by id, links to the table, has a player_type of x or o, stores the position of the move 0-8, and the time of the move
move_id, game_id, player_type, positon, move_time
