import { accounts } from '../shared/accounts';

export default {
    teams: {
        west: {},
        south: {}
    },
    loginAsPlayer(emailAddress) {
        const account = accounts[emailAddress];
        
        if (account && !this.accountInUse(account)) {
            this.teams[account.team][account.name] = account;
            return account;
        }
    },
    accountInUse(account) {
        return this.teams[account.team][account.name];
    },
    logoutPlayer(player){
        delete this.teams[player.team][player.name];
    },
    mergeUpdate(update) {
        const curr = this.teams[update.team][update.name];
        this.teams[update.team][update.name] = { ...curr, ...update};
    }
};