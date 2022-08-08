const crypto = require('crypto')
class PasswordHandler {

    generatePassword(password) {
        try {
            const salt = password.length
            const hashedCrypto = this.passwordCryptoHash(password)
            const subHashedCrypto = this.sliceHash(hashedCrypto, salt)
            const hashedCryptoWithSpecialChars = this.addSpecialCharsAtHashAndShuffle(subHashedCrypto)
            return hashedCryptoWithSpecialChars
        } catch (error) {
            console.error(error)
        }
    }

    generateSalt(password) {
        return password.length
    }

    passwordCryptoHash(password) {
        return crypto.createHash('sha256')
            .update(password)
            .digest('hex');
    }

    sliceHash(hashedCrypto, salt) {
        const blocksOfHash = []
        for (let index = 0; index < hashedCrypto.length; index += salt) {
            const block = hashedCrypto.substring(index, index + salt)
            if (block.length < salt) {
                blocksOfHash[blocksOfHash.length - 1] += block
            } else {
                blocksOfHash.push(block)
            }
        }
        return blocksOfHash
    }

    addSpecialCharsAtHashAndShuffle(hashedBlocks) {
        for (let index = 0; index < hashedBlocks.length; index++) {
            hashedBlocks[index] = `${this.getASpecialChar()}.${index};${hashedBlocks[index]}`
        }
        hashedBlocks = this.shuffle(hashedBlocks)
        return hashedBlocks.toString().replace(/,/g, '')
    }

    getASpecialChar() {
        const specialChars = "!@#$%&-_=+"
        const randomNumber = Math.floor(Math.random() * specialChars.length)
        return specialChars[randomNumber]
    }

    shuffle(hashedBlocks) {
        const randomBlocks = []
        while (hashedBlocks.length) {
            let randomIndex = Math.floor(Math.random() * hashedBlocks.length)
            randomBlocks.push(hashedBlocks.splice(randomIndex, 1))
        }
        return randomBlocks
    }

    compare(user, password) {
        const { password: userPass } = user
        const formattedHash = this.sortHash(userPass)
        const cryptoPassword = this.passwordCryptoHash(password)
        if (cryptoPassword == formattedHash) {
            return true
        } else {
            return false
        }
    }

    sortHash(hash) {
        let node;
        const splittedHash = hash.split(/(?=[\!\@\#\$\%\&\-\_\=\+].\d;)/g)
        for (const block of splittedHash) {
            const blockMount = this.mountBlockObject(block)
            if (!node) {
                const blockNode = new HashNode(blockMount, undefined)
                node = blockNode
            } else {
                node = this.shuffleNodes(node, blockMount)
            }
        }
        const formattedHash = this.formatHash(node)
        return formattedHash
    }

    shuffleNodes(node, block) {
        if (!node) {
            node = new HashNode(block, undefined)
            return node
        }
        if (node.current.key < block.key) {
            if (!node.next) {
                node.next = new HashNode(block, undefined)
                return node
            }
            if (node.next.current.key > block.key) {
                node.next = new HashNode(block, node.next)
                return node
            } else {
                if (node.current.key > block.key) { 
                    node = new HashNode(block, node.current)
                    return node
                } else {
                    if (!node.next) {
                        node.next = new HashNode(block, undefined)
                        return node
                    }
                    this.shuffleNodes(node.next, block)
                    return node
                }
            }
        } else if (node.current.key > block.key) { //4 > 1
            node = new HashNode(block, node) //1, 4
        }
        return node
    }

    formatHash(node, str = '') {
        if (node.next) {
            return this.formatHash(node.next, `${str}${node.current.value}`)
        }
        if(node.current && !node.next){
            return `${str}${node.current.value}`
        }
        return str
    }

    mountBlockObject(block) {
        const blockObject = {
            key: 0,
            value: ''
        }
        const [specialChars] = block.match(/([\!\@\#\$\%\&\-\_\=\+].[0-9];)/g);
        const [index] = specialChars.match(/[0-9]/g);
        blockObject.key = parseInt(index)
        blockObject.value = block.replace(specialChars, '')
        return blockObject
    }

}

class HashNode {
    constructor(current, next) {
        this.current = current
        this.next = next
    }
}

module.exports = new PasswordHandler()