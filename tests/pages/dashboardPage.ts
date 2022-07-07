import { Locator, Page } from "@playwright/test";

export class DashboardPage {
    readonly page: Page
    readonly header: Locator
    readonly FAQButton: Locator
    readonly newsButton: Locator
    readonly userMenuPopUp: Locator
    readonly upgradeButton: Locator
    readonly userMenuButton: Locator
    readonly signOutButton: Locator
    readonly signOutToastAlert: Locator
    readonly bottomUgradeBanner: Locator
    readonly relayExtensionBanner: Locator
    readonly dashBoardWithoutMasks: Locator
    readonly dashBoardWithoutMasksEmail: Locator
    readonly generateNewMaskButton: Locator
    readonly emailsForwardedAmount: Locator
    readonly emailsBlockedAmount: Locator
    readonly emailMasksUsedAmount: Locator
    readonly maskCard: Locator
    readonly maskCardExpanded: Locator
    readonly maskCardHeader: Locator
    readonly maskCardForwardEmail: Locator
    readonly maskCardCreatedDate: Locator
    readonly maskCardGeneratedEmail: Locator
    readonly maskCardForwardedAmount: Locator
    readonly maskCardRepliesAmount: Locator
    readonly maskCardBlockedAmount: Locator
    readonly maskCardDeleteButton: Locator
    readonly maskCardCancelButton: Locator
    readonly dashboardPageWithoutHeader: Locator
    readonly maskCardDeleteDialogModal: Locator
    readonly maskCardDeleteDialogModalEmailString: Locator
    readonly maskCardDeleteDialogModalGeneratedEmail: Locator
    readonly maskCardDeleteConfirmationCheckbox: Locator
    readonly maskCardFinalDeleteButton: Locator
    readonly maxMaskLimitButton: Locator

    constructor(page: Page){
        this.page = page;

        // dashboard header elements
        this.header = page.locator('div header').first();
        this.FAQButton = page.locator('header >> text=FAQ')
        this.newsButton = page.locator('header >> text=News')
        this.userMenuButton = page.locator('//div[starts-with(@class, "UserMenu_wrapper")]')
        this.userMenuPopUp = page.locator('//ul[starts-with(@class, "UserMenu_popup")]')
        this.signOutButton = page.locator('button:has-text("Sign Out")').first()
        this.signOutToastAlert = page.locator('//div[@class="Toastify__toast-body"]')

        // dashboard elements
        this.upgradeButton = page.locator('a:has-text("Upgrade")').first()
        this.dashboardPageWithoutHeader = page.locator('//main[starts-with(@class, "profile_profile-wrapper")]')
        this.emailsForwardedAmount = page.locator('(//dd[starts-with(@class, "profile_value")])[3]')
        this.emailsBlockedAmount = page.locator('(//dd[starts-with(@class, "profile_value")])[2]')
        this.emailMasksUsedAmount = page.locator('(//dd[starts-with(@class, "profile_value")])[1]')
        this.generateNewMaskButton = page.locator('button:has-text("Generate new mask")')
        this.maxMaskLimitButton = page.locator('//div[starts-with(@class, "AliasList_controls__XMrn9")]//a[starts-with(@class, "Button_button")]')
        this.bottomUgradeBanner = page.locator('//div[starts-with(@class, "profile_bottom-banner-wrapper")]')
        this.relayExtensionBanner = page.locator('//section[starts-with(@class, "profile_banners-wrapper")]/div')
        this.dashBoardWithoutMasks = page.locator('//section[starts-with(@class, "Onboarding_wrapper")]')
        this.dashBoardWithoutMasksEmail = page.locator('//section[starts-with(@class, "profile_no-premium-header")]')

        // mask card elements
        this.maskCard = page.locator('//div[starts-with(@class, "Alias_alias-card")]')
        this.maskCardExpanded = page.locator('//ul/li//div[contains(@class, "Alias_is-expanded")]').first()
        this.maskCardHeader = page.locator('//*[starts-with(@class, "Alias_main-data")]')
        this.maskCardGeneratedEmail = page.locator('(//span[starts-with(@class, "Alias_copy-button")]/button)[1]')
        this.maskCardForwardEmail = page.locator('//div[starts-with(@class, "Alias_forward-target")]')
        this.maskCardCreatedDate = page.locator('//div[starts-with(@class, "Alias_date-created")]')
        this.maskCardForwardedAmount = page.locator('(//span[contains(@class, "Alias_forwarded-stat")])[1]')
        this.maskCardRepliesAmount = page.locator('(//span[contains(@class, "Alias_blocked-stat")])[2]')
        this.maskCardBlockedAmount = page.locator('(//span[contains(@class, "Alias_blocked-stat")])[1]')
        this.maskCardDeleteButton = page.locator('(//button[starts-with(@class, "AliasDeletionButton_deletion")])[1]')
        this.maskCardCancelButton = page.locator('(//button[starts-with(@class, "AliasDeletionButton_cancel-button")])[1]')
        this.maskCardDeleteDialogModal = page.locator('//div[starts-with(@class, "AliasDeletionButton_dialog-wrapper")]')
        this.maskCardDeleteDialogModalEmailString = page.locator('//div[starts-with(@class, "AliasDeletionButton_dialog-wrapper")]//strong')
        this.maskCardDeleteDialogModalGeneratedEmail = page.locator('//div[starts-with(@class, "AliasDeletionButton_dialog-wrapper")]//samp')
        this.maskCardDeleteConfirmationCheckbox = page.locator('#confirmDeletion')
        this.maskCardFinalDeleteButton = page.locator('//button[contains(@class, "Button_is-destructive")]')
    } 

    async generateMask(numberOfMasks = 1){        
        // check if max number of masks have been created
        if(numberOfMasks === 0){
            return
        }         
        // generate a new mask and confirm
        await this.generateNewMaskButton.click({ force: true })
        await this.page.waitForSelector('//div[starts-with(@class, "Alias_alias-card")]', { timeout: 3000 })       

        // wait for 1 sec and run flow again with the next masks
        await this.page.waitForTimeout(1000)
        await this.generateMask(numberOfMasks - 1)
    }    

    async upgrade(){        
        await Promise.all([
            this.page.waitForNavigation(),
            this.upgradeButton.click({ force: true })
        ]);        
    }

    async deleteMask(clearAll = false, numberOfMasks = 1){  
        console.log(`Deleting ${numberOfMasks} mask email(s)`)        
        let isExpanded = false

        // check number of masks available
        if(numberOfMasks === 0){
            return
        }

        // if clear all, check if expanded
        if(clearAll){            
            isExpanded = await this.maskCardExpanded.isVisible()
            numberOfMasks = await this.maskCard.count()
            console.log(`Number of Masks to delete: `, numberOfMasks)
        }
        
        // locate mask expand button only if mask is not already expanded
        if(!isExpanded){
            try {
                const anchorLocator = `(//div[starts-with(@class, "Alias_expand-toggle")])[${numberOfMasks}]//button`
                await this.page.waitForSelector(anchorLocator, { timeout: 2000 })
                let anchor = this.page.locator(anchorLocator)
                await anchor.scrollIntoViewIfNeeded()
                await anchor.click({ force: true })
            } catch(err){
                console.log('No current masks')
                return
            }
        }
        
        // delete flow
        const currentMaskCardDeleteButton = this.page.locator(`(//button[starts-with(@class, "AliasDeletionButton_deletion")])[${numberOfMasks}]`)
        await currentMaskCardDeleteButton.click({ force: true })
        await this.maskCardDeleteConfirmationCheckbox.click({ force: true })
        await this.maskCardFinalDeleteButton.click({ force: true })

        // wait for 1 sec and run flow again with the next masks
        await this.page.waitForTimeout(1000)
        await this.deleteMask(true, numberOfMasks - 1)
    }
}