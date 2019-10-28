import Options from './Options.js'

class UserOptions extends Options {
    constructor() {
        super(
            'preferences',
            {
                autoplay: false,
                activeTab: false
            },
            'sync'
        )
    }
}

const instance = new UserOptions();
export default instance;