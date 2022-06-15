// MADE BY: EurekaDAO, BoiseITGuru

// This contract is for BusinessCitadel a multipurpose multi-sig system
// allowing businesses to create their Web3 presence, store business funds
// and information, as well as provide an identity management solutions for
// employees. This first version of the software will not support other Fungible
// or NonFungible tokens while we explore the nessissary KYC/KYB requirments.

// BusinessCitadel aims to be a one stop shop for businesses to manage their employees
// and eventually provide a platform for businesses to interact with each other both in
// person and within Web3 applications.

//CREDTIS: Huge shout out to Jacob at Emerald City DAO for the cadence bootcamp! A good
// portion of the initial contracts are based of his contracts for FLOATS

import NonFungibleToken from 0xf8d6e0586b0a20c7
import MetadataViews from 0xf8d6e0586b0a20c7
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0xf8d6e0586b0a20c7
// import NonFungibleToken from "../core-contracts/NonFungibleToken.cdc"
// import MetadataViews from "../core-contracts/MetadataViews.cdc"
// import FungibleToken from "../core-contracts/FungibleToken.cdc"
// import FlowToken from "../core-contracts/FlowToken.cdc"

pub contract BusinessCitadelCore: NonFungibleToken {
    /***********************************************/
    /******************** PATHS ********************/
    /***********************************************/

    pub let EmployeeBadgeCollectionStoragePath: StoragePath
    pub let EmployeeBadgeCollectionPublicPath: PublicPath
    pub let BusinessCitadelsStoragePath: StoragePath
    pub let BusinessCitadelsPublicPath: PublicPath
    pub let BusinessCitadelsPrivatePath: PrivatePath

    /************************************************/
    /******************** EVENTS ********************/
    /************************************************/

    pub event ContractInitialized()
    pub event EmployeeBadgeMinted(id: UInt64, eventHost: Address, eventId: UInt64, eventImage: String, recipient: Address, serial: UInt64)
    pub event EmployeeBadgeIssued(id: UInt64, eventHost: Address, eventId: UInt64, eventImage: String, eventName: String, recipient: Address, serial: UInt64)
    pub event EmployeeBadgeDestroyed(id: UInt64, eventHost: Address, eventId: UInt64, serial: UInt64)
    pub event EmployeeBadgeTransferred(id: UInt64, eventHost: Address, eventId: UInt64, newOwner: Address?, serial: UInt64)
    pub event BusinessCitadelCreated(eventId: UInt64, description: String, host: Address, image: String, name: String, url: String)
    pub event BusinessCitadelDestroyed(eventId: UInt64, host: Address, name: String)

    pub event Deposit(id: UInt64, to: Address?)
    pub event Withdraw(id: UInt64, from: Address?)

    /***********************************************/
    /******************** STATE ********************/
    /***********************************************/

    // The total amount of EmployeeBadges that have ever been
    // created (does not go down when a EmployeeBadge is destroyed)
    pub var totalSupply: UInt64

    // The total amount of BusinessCitadels that have ever been
    // created (does not go down when a BusinessCitadel is destroyed)
    pub var businessCitadelTotalSupply: UInt64

    /***********************************************/
    /**************** FUNCTIONALITY ****************/
    /***********************************************/

    // A helpful wrapper to contain an address, 
    // the id of a EmployeeBadge, and its serial
    pub struct TokenIdentifier {
        pub let id: UInt64
        pub let address: Address
        pub let serial: UInt64

        init(_id: UInt64, _address: Address, _serial: UInt64) {
            self.id = _id
            self.address = _address
            self.serial = _serial
        }
    }

    pub struct TokenInfo {
        pub let path: PublicPath
        pub let price: UFix64

        init(_path: PublicPath, _price: UFix64) {
            self.path = _path
            self.price = _price
        }
    }

    // Represents a EmployeeBadge
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        // The `uuid` of this resource
        pub let id: UInt64

        // Some of these are also duplicated on the BusinessCitadel,
        // but it's necessary to put them here as well
        // in case the BusinessCitadel host deletes it
        pub let dateReceived: UFix64
        pub let businessCitadelDescription: String
        pub let businessCitadelAddress: Address
        pub let businessCitadelId: UInt64
        pub let businessCitadelImage: String
        pub let businessCitadelName: String
        pub let originalRecipient: Address
        pub let serial: UInt64

        // A capability that points to the BusinessCitadels this EmployeeBadge is from.
        // There is a chance the event BusinessCitadel unlinks their BusinessCitadel from
        // the public, in which case it's impossible to know details
        // about the BusinessCitadel. Which is fine, since we store the
        // crucial data to know about the EmployeeBadge in the EmployeeBadge itself.
        pub let businessCitadelsCap: Capability<&BusinessCitadels{BusinessCitadelsPublic, MetadataViews.ResolverCollection}>
        
        // Helper function to get the metadata of the BusinessCitadel 
        // this EmployeeBadge is from.
        pub fun getBusinessCitadelMetadata(): &BusinessCitadel{BusinessCitadelPublic}? {
            if let events = self.businessCitadelsCap.borrow() {
                return events.borrowPublicBusinessCitadelRef(businessCitadelId: self.businessCitadelId)
            }
            return nil
        }

        // This is for the MetdataStandard
        pub fun getViews(): [Type] {
             return [
                Type<MetadataViews.Display>(),
                Type<TokenIdentifier>()
            ]
        }

        // This is for the MetdataStandard
        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.businessCitadelName, 
                        description: self.businessCitadelDescription, 
                        file: MetadataViews.IPFSFile(cid: self.businessCitadelImage, path: nil)
                    )
                case Type<TokenIdentifier>():
                    return TokenIdentifier(
                        _id: self.id, 
                        _address: self.owner!.address,
                        _serial: self.serial
                    ) 
            }

            return nil
        }

        init(_businessCitadelDescription: String, _businessCitadelAddress: Address, _businessCitadelId: UInt64, _businessCitadelImage: String, _businessCitadelName: String, _originalRecipient: Address, _serial: UInt64) {
            self.id = self.uuid
            self.dateReceived = getCurrentBlock().timestamp
            self.businessCitadelDescription = _businessCitadelDescription
            self.businessCitadelAddress = _businessCitadelAddress
            self.businessCitadelId = _businessCitadelId
            self.businessCitadelImage = _businessCitadelImage
            self.businessCitadelName = _businessCitadelName
            self.originalRecipient = _originalRecipient
            self.serial = _serial

            // Stores a capability to the BusinessCitadels of its creator
            self.businessCitadelsCap = getAccount(_businessCitadelAddress)
                .getCapability<&BusinessCitadels{BusinessCitadelsPublic, MetadataViews.ResolverCollection}>(BusinessCitadelCore.BusinessCitadelsPublicPath)
            
            emit EmployeeBadgeMinted(
                id: self.id, 
                eventHost: _businessCitadelAddress, 
                eventId: _businessCitadelId, 
                eventImage: _businessCitadelImage,
                recipient: _originalRecipient,
                serial: _serial
            )

            BusinessCitadelCore.totalSupply = BusinessCitadelCore.totalSupply + 1
        }

        destroy() {
            // If the FLOATEvent owner decided to unlink their public reference
            // for some reason (heavily recommend against it), their records
            // of who owns the FLOAT is going to be messed up. But that is their
            // fault. We shouldn't let that prevent the user from deleting the FLOAT.
            if let employeeBadge: &BusinessCitadel{BusinessCitadelPublic} = self.getBusinessCitadelMetadata() {
                employeeBadge.updateEmployeeBadgeHome(id: self.id, serial: self.serial, owner: nil)
            }
            emit EmployeeBadgeDestroyed(
                id: self.id, 
                eventHost: self.businessCitadelAddress, 
                eventId: self.businessCitadelId, 
                serial: self.serial
            )
        }
    }

    // A public interface for people to call into our Collection
    pub resource interface CollectionPublic {
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowEmployeeBadge(id: UInt64): &NFT?
        pub fun borrowViewResolver(id: UInt64): &{MetadataViews.Resolver}
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun getAllIDs(): [UInt64]
        pub fun ownedIdsFromBusinessCitadel(businessCitadelId: UInt64): [UInt64]
    }

    // A Collection that holds all of the users EmployeeBadges.
    // Withdrawing is not allowed. You can only transfer.
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection, CollectionPublic {
        // Maps an EmployeeBadge id to the EmployeeBadge itself
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}
        // Maps an businessCitadelId to the ids of EmployeeBadges that
        // this user owns from that BusinessCitadel. It's possible
        // for it to be out of sync until June 2022 spork, 
        // but it is used merely as a helper, so that's okay.
        access(account) var businessCitadels: {UInt64: {UInt64: Bool}}

        // Deposits an EmployeeBadge to the collection
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let nft <- token as! @NFT
            let id = nft.id
            let businessCitadelId = nft.businessCitadelId
        
            // Update self.businessCitadels[businessCitadelId] to have
            // this EmployeeBadge's id in it
            if self.businessCitadels[businessCitadelId] == nil {
                self.businessCitadels[businessCitadelId] = {id: true}
            } else {
                self.businessCitadels[businessCitadelId]!.insert(key: id, true)
            }

            // Try to update the BusinessCitadel's current holders. This will
            // not work if they unlinked their BusinessCitadel to the public,
            // and the data will go out of sync. But that is their fault.
            if let businessCitadel: &BusinessCitadel{BusinessCitadelPublic} = nft.getBusinessCitadelMetadata() {
                businessCitadel.updateEmployeeBadgeHome(id: id, serial: nft.serial, owner: self.owner!.address)
            }

            emit Deposit(id: id, to: self.owner!.address)
            self.ownedNFTs[id] <-! nft
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("You do not own this EmployeeBadge in your collection")
            let nft <- token as! @NFT
            let id = nft.id

            // Update self.businessCitadels[businessCitadelId] to not
            // have this EmployeeBadge's id in it
            self.businessCitadels[nft.businessCitadelId]!.remove(key: id)

            // Try to update the BusinessCitadel's current holders. This will
            // not work if they unlinked their BusinessCitadel to the public,
            // and the data will go out of sync. But that is their fault.
            //
            // Additionally, this checks if the BusinessCitadel host wanted this
            // EmployeeBadge to be transferrable.
            if let businessCitadel: &BusinessCitadel{BusinessCitadelPublic} = nft.getBusinessCitadelMetadata() {
                assert(
                    businessCitadel.transferrable, 
                    message: "This EmployeeBadge is not transferrable."
                )
                businessCitadel.updateEmployeeBadgeHome(id: nft.id, serial: nft.serial, owner: nil)
            }

            emit Withdraw(id: id, from: self.owner!.address)
            return <- nft
        }

        // Only returns the EmployeeBadges for which we can still
        // access data about their BusinessCitadel.
        pub fun getIDs(): [UInt64] {
            let ids: [UInt64] = []
            for key in self.ownedNFTs.keys {
                let nftRef = self.borrowEmployeeBadge(id: key)!
                if nftRef.businessCitadelsCap.check() {
                    ids.append(key)
                }
            }
            return ids
        }

        // Returns all the EmployeeBadges ids
        pub fun getAllIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // Returns an array of ids that belong to
        // the passed in businessCitadelId
        //
        // It's possible for EmployeeBadge ids to be present that
        // shouldn't be if people tried to withdraw directly
        // from `ownedNFTs` (not possible after June 2022 spork), 
        // but this makes sure the returned
        // ids are all actually owned by this account.
        pub fun ownedIdsFromBusinessCitadel(businessCitadelId: UInt64): [UInt64] {
            let answer: [UInt64] = []
            if let idsInEvent = self.businessCitadels[businessCitadelId]?.keys {
                for id in idsInEvent {
                    if self.ownedNFTs[id] != nil {
                        answer.append(id)
                    }
                }
            }
            return answer
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowEmployeeBadge(id: UInt64): &NFT? {
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?
            return ref as! &NFT?
        }

        pub fun borrowViewResolver(id: UInt64): &{MetadataViews.Resolver} {
            let tokenRef = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let nftRef = tokenRef as! &NFT
            return nftRef as &{MetadataViews.Resolver}
        }

        init() {
            self.ownedNFTs <- {}
            self.businessCitadels = {}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // An interface that every "verifier" must implement. 
    // A verifier is one of the options on the BusinessCitadel page,
    // All the current verifiers can be seen inside EmployeeBadgeVerifiers.cdc
    pub struct interface IVerifier {
        // A function every verifier must implement. 
        // Will have `assert`s in it to make sure
        // the user fits some criteria.
        access(account) fun verify(_ params: {String: AnyStruct})
    }

    // A public interface to read the BusinessCitadel
    pub resource interface BusinessCitadelPublic {
        pub var claimable: Bool
        pub let dateCreated: UFix64
        pub let description: String 
        pub let businessCitadelId: UInt64
        pub let businessCitadelAddress: Address
        pub let image: String 
        pub let name: String
        pub var totalSupply: UInt64
        pub var transferrable: Bool
        pub let url: String
        pub fun issue(recipient: &Collection, params: {String: AnyStruct})
        pub fun getIssued(): {Address: TokenIdentifier}
        pub fun getCurrentEmployees(): {UInt64: TokenIdentifier}
        pub fun getVerifyCurrentEmployee(serial: UInt64): TokenIdentifier?
        pub fun getExtraMetadata(): {String: AnyStruct}
        pub fun getVerifiers(): {String: [{IVerifier}]}
        pub fun getDepartments(): [String]
        pub fun hasClaimed(account: Address): TokenIdentifier?
        access(account) fun updateEmployeeBadgeHome(id: UInt64, serial: UInt64, owner: Address?)
    }

    //
    // BusinessCitadel
    //
    pub resource BusinessCitadel: BusinessCitadelPublic, MetadataViews.Resolver {
        // Whether or not employees can claim from our BusinessCitadel (can be toggled
        // at any time)
        pub var claimable: Bool
        // Maps an address to the EmployeeBadge they were issued
        access(account) var issued: {Address: TokenIdentifier}
        // Maps a serial to the person who theoretically owns
        // that EmployeeBadge. Must be serial --> TokenIdentifier because
        // it's possible someone has multiple EmployeeBadges from this BusinessCitadel.
        access(account) var currentEmployees: {UInt64: TokenIdentifier}
        pub let dateCreated: UFix64
        pub let description: String 
        // This is equal to this resource's uuid
        pub let businessCitadelId: UInt64
        access(account) var extraMetadata: {String: AnyStruct}
        // The departments within this BusinessCitadel (departments
        // are within the BusinessCitadels resource)
        access(account) var departments: {String: Bool}
        // Who created this BusinessCitadel
        pub let businessCitadelAddress: Address
        // The image of the BusinessCitadel
        pub let image: String 
        // The name of the BusinessCitadel
        pub let name: String
        // The total number of EmployeeBadges that have been
        // minted from this BusinessCitadel
        pub var totalSupply: UInt64
        // Whether or not the EmployeeBadges that employees own
        // from this BusinessCitadel can be transferred to another
        // verified wallet account.
        pub var transferrable: Bool
        // A url of the BusinessCitadel
        pub let url: String
        // A list of verifiers this BusinessCitadel contains.
        // Will be used every time someone "claims" an EmployeeBadge
        // to see if they pass the requirements
        access(account) let verifiers: {String: [{IVerifier}]}

        /***************** Setters for the BusinessCitadel Owner/Multi-Sig *****************/

        // Toggles claiming on/off
        pub fun toggleClaimable(): Bool {
            self.claimable = !self.claimable
            return self.claimable
        }

        // Toggles transferring on/off
        pub fun toggleTransferrable(): Bool {
            self.transferrable = !self.transferrable
            return self.transferrable
        }

        // Updates the metadata in case you want
        // to add something. 
        pub fun updateMetadata(newExtraMetadata: {String: AnyStruct}) {
            for key in newExtraMetadata.keys {
                if !self.extraMetadata.containsKey(key) {
                    self.extraMetadata[key] = newExtraMetadata[key]
                }
            }
        }

        /***************** Setters for the Contract Only *****************/

        // Called if a user moves their EmployeeBadge to another location.
        // Needed so we can keep track of which wallet currently has it.
        access(account) fun updateEmployeeBadgeHome(id: UInt64, serial: UInt64, owner: Address?) {
            if owner == nil {
                self.currentEmployees.remove(key: serial)
            } else {
                self.currentEmployees[serial] = TokenIdentifier(
                    _id: id,
                    _address: owner!,
                    _serial: serial
                )
            }
            emit EmployeeBadgeTransferred(id: id, eventHost: self.businessCitadelAddress, eventId: self.businessCitadelId, newOwner: owner, serial: serial)
        }

        // Adds a department to this BusinessCitadel
        access(account) fun addDepartment(departmentName: String) {
            self.departments[departmentName] = true
        }

        // Removes a department from this BusinessCitadel
        access(account) fun removeDepartment(departmentName: String) {
            self.departments.remove(key: departmentName)
        }

        /***************** Getters (all exposed to the public) *****************/

        // Returns info about the EmployeeBadge that this account claimed
        // (if any)
        pub fun hasClaimed(account: Address): TokenIdentifier? {
            return self.issued[account]
        }

        // This is a guarantee that the person owns the EmployeeBadge
        // with the passed in serial
        pub fun getVerifyCurrentEmployee(serial: UInt64): TokenIdentifier? {
            pre {
                self.currentEmployees[serial] != nil:
                    "This serial has not been created yet."
            }
            let data = self.currentEmployees[serial]!
            let collection = getAccount(data.address).getCapability(BusinessCitadelCore.EmployeeBadgeCollectionPublicPath).borrow<&Collection{CollectionPublic}>() 
            if collection?.borrowEmployeeBadge(id: data.id) != nil {
                return data
            }
                
            return nil
        }

        // Returns an accurate dictionary of all the
        // issued employees
        pub fun getIssued(): {Address: TokenIdentifier} {
            return self.issued
        }

        // This dictionary may be slightly off if for some
        // reason the BusinessCitadels owner ever unlinked their
        // resource from the public.  
        // Use `getCurrentEmployee(serial: UInt64)` to truly
        // verify if someone holds that serial.
        pub fun getCurrentEmployees(): {UInt64: TokenIdentifier} {
            return self.currentEmployees
        }

        pub fun getExtraMetadata(): {String: AnyStruct} {
            return self.extraMetadata
        }

        // Gets all the verifiers that will be used
        // for claiming
        pub fun getVerifiers(): {String: [{IVerifier}]} {
            return self.verifiers
        }

        pub fun getDepartments(): [String] {
            return self.departments.keys
        }

        pub fun getViews(): [Type] {
             return [
                Type<MetadataViews.Display>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name, 
                        description: self.description, 
                        file: MetadataViews.IPFSFile(cid: self.image, path: nil)
                    )
            }

            return nil
        }

        /****************** Getting an EmployeeBadge ******************/

        // Used to give a person a EmployeeBadge from this BusinessCitadel.
        // Used as a helper function for `claim`, but can also be 
        // used by the BusinessCitadel owner/multi-sig to
        // mint directly to an employee. 
        //
        // If the event owner directly mints to an employee, it does not
        // run the verifiers on the user. It bypasses all of them.
        //
        // Return the id of the EmployeeBadge it minted
        pub fun mint(recipient: &Collection{NonFungibleToken.CollectionPublic}): UInt64 {
            pre {
                self.issued[recipient.owner!.address] == nil:
                    "This person already claimed their EmployeeBadge!"
            }
            let recipientAddr: Address = recipient.owner!.address
            let serial = self.totalSupply

            let token <- create NFT(
                _businessCitadelDescription: self.description,
                _businessCitadelAddress: self.businessCitadelAddress, 
                _businessCitadelId: self.businessCitadelId,
                _businessCitadelImage: self.image,
                _businessCitadelName: self.name,
                _originalRecipient: recipientAddr, 
                _serial: serial
            ) 
            let id = token.id
            // Saves the claimer
            self.issued[recipientAddr] = TokenIdentifier(
                _id: id,
                _address: recipientAddr,
                _serial: serial
            )
            // Saves the claimer as the current holder
            // of the newly minted EmployeeBadge
            self.currentEmployees[serial] = TokenIdentifier(
                _id: id,
                _address: recipientAddr,
                _serial: serial
            )

            self.totalSupply = self.totalSupply + 1
            recipient.deposit(token: <- token)
            return id
        }

        access(account) fun verifyAndMint(recipient: &Collection, params: {String: AnyStruct}): UInt64 {
            params["businessCitadel"] = &self as &BusinessCitadel{BusinessCitadelPublic}
            params["claimee"] = recipient.owner!.address
            
            // Runs a loop over all the verifiers that this BusinessCitadel
            // implements.
            // All the verifiers are in the EmployeeBadgeVerifiers.cdc contract
            for identifier in self.verifiers.keys {
                let typedModules = (&self.verifiers[identifier] as &[{IVerifier}]?)!
                var i = 0
                while i < typedModules.length {
                    let verifier = &typedModules[i] as &{IVerifier}
                    verifier.verify(params)
                    i = i + 1
                }
            }

            // You're good to go.
            let id = self.mint(recipient: recipient)

            emit EmployeeBadgeIssued(
                id: id,
                eventHost: self.businessCitadelAddress, 
                eventId: self.businessCitadelId, 
                eventImage: self.image,
                eventName: self.name,
                recipient: recipient.owner!.address,
                serial: self.totalSupply - 1
            )
            return id
        }

        // For the public to claim EmployeeBadges. Must be claimable to do so.
        // You can pass in `params` that will be forwarded to the
        // customized `verify` function of the verifier.  
        pub fun issue(recipient: &Collection, params: {String: AnyStruct}) {
            pre {
                self.issued[recipient.owner!.address] == nil:
                    "This person already claimed their EmployeeBadge!"
                self.claimable: 
                    "This BusinessCitadel is not claimable, and thus not currently active."
            }
            
            self.verifyAndMint(recipient: recipient, params: params)
        }

        init (
            _claimable: Bool,
            _description: String, 
            _extraMetadata: {String: AnyStruct},
            _host: Address, 
            _image: String, 
            _name: String,
            _transferrable: Bool,
            _url: String,
            _verifiers: {String: [{IVerifier}]},
        ) {
            self.claimable = _claimable
            self.issued = {}
            self.currentEmployees = {}
            self.dateCreated = getCurrentBlock().timestamp
            self.description = _description
            self.businessCitadelId = self.uuid
            self.extraMetadata = _extraMetadata
            self.departments = {}
            self.businessCitadelAddress = _host
            self.image = _image
            self.name = _name
            self.transferrable = _transferrable
            self.totalSupply = 0
            self.url = _url
            self.verifiers = _verifiers

            BusinessCitadelCore.businessCitadelTotalSupply = BusinessCitadelCore.businessCitadelTotalSupply + 1
            emit BusinessCitadelCreated(eventId: self.businessCitadelId, description: self.description, host: self.businessCitadelAddress, image: self.image, name: self.name, url: self.url)
        }

        destroy() {
            emit BusinessCitadelDestroyed(eventId: self.businessCitadelId, host: self.businessCitadelAddress, name: self.name)
        }
    }

    // A container of BusinessCitadel Departments (can be used to group any type
    // of departments or groups together inside a business).
    pub resource Department {
        pub let id: UInt64
        pub let name: String
        pub let image: String
        pub let description: String

        /// TO DO: Need to restructure this to support departments inside a BusinessCitadel
        // All the FLOAT Events that belong
        // to this group.
        // access(account) var events: {UInt64: Bool}

        // access(account) fun addEvent(eventId: UInt64) {
        //     self.events[eventId] = true
        // }

        // access(account) fun removeEvent(eventId: UInt64) {
        //     self.events.remove(key: eventId)
        // }

        // pub fun getEvents(): [UInt64] {
        //     return self.events.keys
        // }

        init(_name: String, _image: String, _description: String) {
            self.id = self.uuid
            self.name = _name
            self.image = _image
            self.description = _description
            // self.events = {}
        }
    }

    // 
    // BusinessCitadels
    //
    pub resource interface BusinessCitadelsPublic {
        // Public Getters
        pub fun borrowPublicBusinessCitadelRef(businessCitadelId: UInt64): &BusinessCitadel{BusinessCitadelPublic}?
        pub fun getAllBusinessCitadels(): {UInt64: String}
        pub fun getIDs(): [UInt64]
        // Account Getters
        access(account) fun borrowBusinessCitadelRef(businessCitadelId: UInt64): &BusinessCitadel?
    }

    // A "Collection" of BusinessCitadels
    pub resource BusinessCitadels: BusinessCitadelsPublic, MetadataViews.ResolverCollection {
        // All the BusinessCitadels this collection stores
        access(account) var businessCitadels: @{UInt64: BusinessCitadel}

        // Creates a new BusinessCitadel by passing in some basic parameters
        // and a list of all the verifiers this BusinessCitadel must abide by
        pub fun createBusinessCitadel(
            claimable: Bool,
            description: String,
            image: String, 
            name: String, 
            transferrable: Bool,
            url: String,
            verifiers: [{IVerifier}],
            _ extraMetadata: {String: AnyStruct},
            initialDepartments: [String]
        ): UInt64 {
            let typedVerifiers: {String: [{IVerifier}]} = {}
            for verifier in verifiers {
                let identifier = verifier.getType().identifier
                if typedVerifiers[identifier] == nil {
                    typedVerifiers[identifier] = [verifier]
                } else {
                    typedVerifiers[identifier]!.append(verifier)
                }
            }

            let BusinessCitadel <- create BusinessCitadel(
                _claimable: claimable,
                _description: description, 
                _extraMetadata: extraMetadata,
                _host: self.owner!.address, 
                _image: image, 
                _name: name, 
                _transferrable: transferrable,
                _url: url,
                _verifiers: typedVerifiers
            )
            let businessCitadelId = BusinessCitadel.businessCitadelId
            self.businessCitadels[businessCitadelId] <-! BusinessCitadel

            return businessCitadelId
        }

        // Deletes a BusinessCitadel.
        pub fun deleteEvent(eventId: UInt64) {
            let businessCitadel <- self.businessCitadels.remove(key: eventId) ?? panic("This event does not exist")
            destroy businessCitadel
        }

        pub fun borrowBusinessCitadelRef(businessCitadelId: UInt64): &BusinessCitadel? {
            return &self.businessCitadels[businessCitadelId] as &BusinessCitadel?
        }

        /************* Getters (for anyone) *************/

        // Get a public reference to the BusinessCitadel
        // so you can call some helpful getters
        pub fun borrowPublicBusinessCitadelRef(businessCitadelId: UInt64): &BusinessCitadel{BusinessCitadelPublic}? {
            return &self.businessCitadels[businessCitadelId] as &BusinessCitadel{BusinessCitadelPublic}?
        }

        pub fun getIDs(): [UInt64] {
            return self.businessCitadels.keys
        }

        // Maps the businessCitadelId to the name of that
        // BusinessCitadel. Just a kind helper.
        pub fun getAllBusinessCitadels(): {UInt64: String} {
            let answer: {UInt64: String} = {}
            for id in self.businessCitadels.keys {
                let ref = (&self.businessCitadels[id] as &BusinessCitadel?)!
                answer[id] = ref.name
            }
            return answer
        }

        pub fun borrowViewResolver(id: UInt64): &{MetadataViews.Resolver} {
            return (&self.businessCitadels[id] as &{MetadataViews.Resolver}?)!
        }

        init() {
            self.businessCitadels <- {}
        }

        destroy() {
            destroy self.businessCitadels
        }
    }

    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    pub fun createEmptyFBusinessCitadelCollection(): @BusinessCitadels {
        return <- create BusinessCitadels()
    }

    init() {
        self.totalSupply = 0
        self.businessCitadelTotalSupply = 0
        emit ContractInitialized()

        self.EmployeeBadgeCollectionStoragePath = /storage/EmployeeBadgeCollectionStoragePath
        self.EmployeeBadgeCollectionPublicPath = /public/EmployeeBadgeCollectionPublicPath
        self.BusinessCitadelsStoragePath = /storage/BusinessCitadelsStoragePath
        self.BusinessCitadelsPrivatePath = /private/BusinessCitadelsPrivatePath
        self.BusinessCitadelsPublicPath = /public/BusinessCitadelsPublicPath
    }
}