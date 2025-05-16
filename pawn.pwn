#include <a_samp>
#include <a_mysql>
#include <streamer>

#define MYSQL_HOST   	"localhost"
#define MYSQL_USER  	"root"
#define MYSQL_PASSWORD  ""
#define MYSQL_DATABASE  "botdb"

new MySQL:databaseHandle;

public OnGameModeInit()
{
    if (databaseHandle != MYSQL_INVALID_HANDLE) {
        mysql_close(databaseHandle);
        databaseHandle = MYSQL_INVALID_HANDLE;
    }

    databaseHandle = mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);

    if (databaseHandle == MYSQL_INVALID_HANDLE || mysql_errno(databaseHandle) != 0) {
        SendRconCommand("exit");
        print("[MySQL]: Nao foi possivel conectar com o banco de dados!");
        return false;
    }

    mysql_tquery_file(databaseHandle, "botdb.sql");
    print("[MySQL]: Conexao estabelecida com sucesso.");
    return true;
}

public OnGameModeExit()
{
    for(new i = 0; i < MAX_PLAYERS; i++) {
        if(!IsPlayerConnected(i)) continue;
        Kick(i);
    }
	print("[MySQL]: Conexao com o banco de dados foi finalizada com sucesso!");
	mysql_close(databaseHandle);
    return true;
}

public OnPlayerConnect(playerid)
{
    new name[MAX_PLAYER_NAME];
    GetPlayerName(playerid, name, sizeof(name));

    new query[128];
    mysql_format(databaseHandle, query, sizeof(query), "SELECT status FROM `whitelist` WHERE `username` = '%e' LIMIT 1", name);
    mysql_tquery(databaseHandle, query, "checkingLiberation", "d", playerid);
    return true;
}

forward checkingLiberation(playerid);
public checkingLiberation(playerid)
{
    new status;
    cache_get_value_index_int(0, 0, status);

    if (status != 1) {
        SendClientMessage(playerid, 0xFF0000FF, "Info: Voce nao tem uma whitelist liberada por isso foi desconectado do servidor!");
		SetTimerEx("kickPlayer", 2000, false, "d", playerid);
    }
    return true;
}

forward kickPlayer(playerid);
public kickPlayer(playerid)
	return Kick(playerid);
