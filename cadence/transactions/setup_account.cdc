import BusinessCitadelCore from "../contracts/business-citadel/BusinessCitadelCore.cdc"
import NonFungibleToken from "../contracts/core-contracts/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core-contracts/MetadataViews.cdc"

transaction {

  prepare(acct: AuthAccount) {
    // SETUP COLLECTION
    if acct.borrow<&BusinessCitadelCore.Collection>(from: BusinessCitadelCore.EmployeeBadgeCollectionStoragePath) == nil {
        acct.save(<- BusinessCitadelCore.createEmptyCollection(), to: BusinessCitadelCore.EmployeeBadgeCollectionStoragePath)
        acct.link<&BusinessCitadelCore.Collection{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection, BusinessCitadelCore.CollectionPublic}>
                (BusinessCitadelCore.EmployeeBadgeCollectionPublicPath, target: BusinessCitadelCore.EmployeeBadgeCollectionPublicPath)
    }

    // SETUP BusinessCitadels
    if acct.borrow<&BusinessCitadelCore.BusinessCitadels>(from: BusinessCitadelCore.BusinessCitadelsStoragePath) == nil {
      acct.save(<- BusinessCitadelCore.createEmptyFBusinessCitadelCollection(), to: BusinessCitadelCore.BusinessCitadelsStoragePath)
      acct.link<&BusinessCitadelCore.BusinessCitadels{BusinessCitadelCore.BusinessCitadelsPublic, MetadataViews.ResolverCollection}>
                (BusinessCitadelCore.BusinessCitadelsPublicPath, target: BusinessCitadelCore.BusinessCitadelsStoragePath)
    }
  }

  execute {
    log("Finished setting up the account for FLOATs.")
  }
}
