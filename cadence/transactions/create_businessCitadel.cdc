import BusinessCitadelCore from "../contracts/business-citadel/BusinessCitadelCore.cdc"
import EmployeBadgeVerifiers from "../contracts/business-citadel/EmployeBadgeVerifiers.cdc"
import NonFungibleToken from "../contracts/core-contracts/NonFungibleToken.cdc"
import MetadataViews from "../contracts/core-contracts/MetadataViews.cdc"

transaction(
  claimable: Bool, 
  name: String, 
  description: String, 
  image: String, 
  url: String, 
  transferrable: Bool, 
  timelock: Bool, 
  dateStart: UFix64, 
  timePeriod: UFix64, 
  secret: Bool, 
  secrets: [String], 
  limited: Bool, 
  capacity: UInt64, 
  initialDepartments: [String]
) {

  let BusinessCitadels: &BusinessCitadelCore.BusinessCitadels

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
    
    self.BusinessCitadels = acct.borrow<&BusinessCitadelCore.BusinessCitadels>(from: BusinessCitadelCore.BusinessCitadelsStoragePath) ?? panic("Could not borrow the BusinessCitadels from the signer.")
  }

  execute {
    var Timelock: EmployeBadgeVerifiers.Timelock? = nil
    var Secret: EmployeBadgeVerifiers.Secret? = nil
    var Limited: EmployeBadgeVerifiers.Limited? = nil
    var MultipleSecret: EmployeBadgeVerifiers.MultipleSecret? = nil
    var verifiers: [{BusinessCitadelCore.IVerifier}] = []
    if timelock {
      Timelock = EmployeBadgeVerifiers.Timelock(_dateStart: dateStart, _timePeriod: timePeriod)
      verifiers.append(Timelock!)
    }
    if secret {
      if secrets.length == 1 {
        Secret = EmployeBadgeVerifiers.Secret(_secretPhrase: secrets[0])
        verifiers.append(Secret!)
      } else {
        MultipleSecret = EmployeBadgeVerifiers.MultipleSecret(_secrets: secrets)
        verifiers.append(MultipleSecret!)
      }
    }
    if limited {
      Limited = EmployeBadgeVerifiers.Limited(_capacity: capacity)
      verifiers.append(Limited!)
    }
    let extraMetadata: {String: AnyStruct} = {}

    self.BusinessCitadels.createBusinessCitadel(claimable: claimable, description: description, image: image, name: name, transferrable: transferrable, url: url, verifiers: verifiers, extraMetadata, initialDepartments: initialDepartments)
    log("Started a new BusinessCitadel.")
  }
}  