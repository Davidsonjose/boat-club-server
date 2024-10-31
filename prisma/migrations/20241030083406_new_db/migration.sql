-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'AIRTIME', 'ELECTRICTY');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('loanWallet', 'mainWallet', 'savingWallet', 'contributionWallet');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESSFUL');

-- CreateEnum
CREATE TYPE "ActivityEnumType" AS ENUM ('SIGNUP', 'SIGNIN', 'SEND_OTP', 'CHANGE_PASSWORD', 'UPDATE_PIN', 'SETTINGS_UPDATE', 'DELETE_USER', 'CHANGE_EMAIL', 'CHANGE_PHONE', 'FORGOT_PASSWORD', 'TRANSFER_MONEY', 'FUND_CONTRIBUTION_WALLET');

-- CreateEnum
CREATE TYPE "KycLevel" AS ENUM ('Tier1', 'Tier2', 'Tier3');

-- CreateEnum
CREATE TYPE "SavingCategoryType" AS ENUM ('SPEND_AND_SAVE', 'FIXED_SAVINGS', 'TARGET_SAVINGS');

-- CreateEnum
CREATE TYPE "LoanCategoryType" AS ENUM ('GOAL_BASED_LOAN', 'PAYDAY_LOAN');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('OPEN', 'CLOSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('SERVER', 'USER');

-- CreateEnum
CREATE TYPE "KycVerificationStatus" AS ENUM ('NOT_STARTED', 'SUCCESSFUL', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'DISAPPROVED');

-- CreateEnum
CREATE TYPE "TargetSavingPaymentFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT,
    "pass" TEXT NOT NULL,
    "referralCode" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "active" BOOLEAN NOT NULL,
    "emailVerified" BOOLEAN DEFAULT false,
    "hasPin" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL,
    "pin" TEXT,
    "loanId" INTEGER,
    "profileImageUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "pushNotificationToken" TEXT,
    "phoneNumberVerified" BOOLEAN DEFAULT false,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saving" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "savingsWalletId" INTEGER NOT NULL,

    CONSTRAINT "Saving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "tourCategoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubLocation" (
    "id" SERIAL NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "tourId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "loanWalletId" INTEGER,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpendAndSave" (
    "id" SERIAL NOT NULL,
    "ongoing" BOOLEAN DEFAULT false,
    "percentage" TEXT,
    "savingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SpendAndSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TargetSaving" (
    "id" SERIAL NOT NULL,
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "frequentAmount" DOUBLE PRECISION NOT NULL,
    "paymentFrequency" "TargetSavingPaymentFrequency" NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "targetAmount" DOUBLE PRECISION,
    "interest" DOUBLE PRECISION NOT NULL,
    "savingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TargetSaving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedSaving" (
    "id" SERIAL NOT NULL,
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "endDate" TIMESTAMP(3) NOT NULL,
    "interest" DOUBLE PRECISION NOT NULL,
    "savingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "FixedSaving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalBasedLoan" (
    "id" SERIAL NOT NULL,
    "ongoing" BOOLEAN DEFAULT false,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "interestAmount" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "paydayDueDate" TIMESTAMP(3),
    "documents" TEXT,
    "loanId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GoalBasedLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaydayLoan" (
    "id" SERIAL NOT NULL,
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "interestAmount" DOUBLE PRECISION NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "documents" TEXT,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "paydayDueDate" TIMESTAMP(3),
    "loanId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PaydayLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kyc" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentLevel" "KycLevel" NOT NULL DEFAULT 'Tier1',

    CONSTRAINT "Kyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "activityHash" TEXT NOT NULL,
    "activityType" "ActivityEnumType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "usage" INTEGER NOT NULL,
    "expectedUsage" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "dialCode" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "borders" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "utc" TEXT NOT NULL,
    "isEu" BOOLEAN NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "twoFaEnabledEmail" BOOLEAN NOT NULL,
    "twoFaEnabledPhone" BOOLEAN NOT NULL,
    "enablePushNotification" BOOLEAN NOT NULL DEFAULT true,
    "enableEmailNotification" BOOLEAN NOT NULL DEFAULT true,
    "languageCode" TEXT NOT NULL DEFAULT 'EN',
    "defaultCurrencyCode" TEXT NOT NULL DEFAULT 'USD',
    "defaultCurrencyName" TEXT NOT NULL DEFAULT 'United State Dollar',
    "defaultCurrencySymbol" TEXT NOT NULL DEFAULT '$',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier1" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "kycId" INTEGER NOT NULL,
    "verificationStatus" "KycVerificationStatus" NOT NULL DEFAULT 'NOT_STARTED',

    CONSTRAINT "Tier1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier2" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "faceVerificationUrl" TEXT,
    "faceVerified" BOOLEAN NOT NULL DEFAULT false,
    "addressVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "kycId" INTEGER NOT NULL,
    "verificationStatus" "KycVerificationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "trial" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tier2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier3" (
    "id" SERIAL NOT NULL,
    "bvn" TEXT,
    "bvnVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycId" INTEGER NOT NULL,
    "kycSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "KycVerificationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "trial" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tier3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionWallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ContributionWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointWallet" (
    "id" SERIAL NOT NULL,
    "banicoopPoints" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PointWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingsWallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SavingsWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainWallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,

    CONSTRAINT "MainWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanWallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoanWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "walletType" "WalletType" NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "transactionStatus" "TransactionStatus" NOT NULL,
    "transactionRef" TEXT,
    "loanWalletId" INTEGER,
    "contributionWalletId" INTEGER,
    "savingsWalletId" INTEGER,
    "mainWalletId" INTEGER,
    "savingId" INTEGER,
    "joinContributionId" INTEGER,
    "userId" INTEGER NOT NULL,
    "spendAndSaveId" INTEGER,
    "targetSavingId" INTEGER,
    "fixedSavingId" INTEGER,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" SERIAL NOT NULL,
    "contributionName" TEXT NOT NULL,
    "monthlyAmount" DOUBLE PRECISION NOT NULL,
    "monthlyOutput" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "participants" INTEGER NOT NULL,
    "fixedMonth" TIMESTAMP(3) NOT NULL,
    "status" "ContributionStatus" NOT NULL DEFAULT 'OPEN',
    "totalUser" INTEGER NOT NULL,
    "totalServer" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "endMonth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionMonth" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "userPaid" INTEGER[],
    "contributionId" INTEGER NOT NULL,
    "fixedMonth" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContributionMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinContribution" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "contributionId" INTEGER,
    "monthOfCollection" TIMESTAMP(3),
    "participantNumber" INTEGER,
    "interestFee" DOUBLE PRECISION,
    "faultingFee" DOUBLE PRECISION,
    "monthsRemaining" INTEGER,
    "dayOfRemittance" TEXT,
    "useDetails" BOOLEAN,
    "displayName" TEXT,
    "isServer" BOOLEAN NOT NULL,
    "participantType" "ParticipantType" NOT NULL,
    "serverUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JoinContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerUser" (
    "id" SERIAL NOT NULL,
    "serverUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionUserMonth" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "monthOfCollection" BOOLEAN NOT NULL,
    "joinContributionId" INTEGER NOT NULL,

    CONSTRAINT "ContributionUserMonth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_locationId_key" ON "User"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Saving_userId_key" ON "Saving"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TourCategory_name_key" ON "TourCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_userId_key" ON "Loan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_loanWalletId_key" ON "Loan"("loanWalletId");

-- CreateIndex
CREATE UNIQUE INDEX "SpendAndSave_savingId_key" ON "SpendAndSave"("savingId");

-- CreateIndex
CREATE UNIQUE INDEX "TargetSaving_savingId_key" ON "TargetSaving"("savingId");

-- CreateIndex
CREATE UNIQUE INDEX "FixedSaving_savingId_key" ON "FixedSaving"("savingId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalBasedLoan_loanId_key" ON "GoalBasedLoan"("loanId");

-- CreateIndex
CREATE UNIQUE INDEX "PaydayLoan_loanId_key" ON "PaydayLoan"("loanId");

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_userId_key" ON "Kyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_userId_key" ON "Location"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tier1_kycId_key" ON "Tier1"("kycId");

-- CreateIndex
CREATE UNIQUE INDEX "Tier2_kycId_key" ON "Tier2"("kycId");

-- CreateIndex
CREATE UNIQUE INDEX "Tier3_kycId_key" ON "Tier3"("kycId");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionWallet_userId_key" ON "ContributionWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PointWallet_userId_key" ON "PointWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavingsWallet_userId_key" ON "SavingsWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MainWallet_userId_key" ON "MainWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LoanWallet_userId_key" ON "LoanWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_userId_key" ON "Transaction"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saving" ADD CONSTRAINT "Saving_savingsWalletId_fkey" FOREIGN KEY ("savingsWalletId") REFERENCES "SavingsWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_tourCategoryId_fkey" FOREIGN KEY ("tourCategoryId") REFERENCES "TourCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLocation" ADD CONSTRAINT "ClubLocation_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_loanWalletId_fkey" FOREIGN KEY ("loanWalletId") REFERENCES "LoanWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendAndSave" ADD CONSTRAINT "SpendAndSave_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetSaving" ADD CONSTRAINT "TargetSaving_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedSaving" ADD CONSTRAINT "FixedSaving_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalBasedLoan" ADD CONSTRAINT "GoalBasedLoan_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaydayLoan" ADD CONSTRAINT "PaydayLoan_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier1" ADD CONSTRAINT "Tier1_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "Kyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier2" ADD CONSTRAINT "Tier2_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "Kyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier3" ADD CONSTRAINT "Tier3_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "Kyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointWallet" ADD CONSTRAINT "PointWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainWallet" ADD CONSTRAINT "MainWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_loanWalletId_fkey" FOREIGN KEY ("loanWalletId") REFERENCES "LoanWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_contributionWalletId_fkey" FOREIGN KEY ("contributionWalletId") REFERENCES "ContributionWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_savingsWalletId_fkey" FOREIGN KEY ("savingsWalletId") REFERENCES "SavingsWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_mainWalletId_fkey" FOREIGN KEY ("mainWalletId") REFERENCES "MainWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_joinContributionId_fkey" FOREIGN KEY ("joinContributionId") REFERENCES "JoinContribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_spendAndSaveId_fkey" FOREIGN KEY ("spendAndSaveId") REFERENCES "SpendAndSave"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_targetSavingId_fkey" FOREIGN KEY ("targetSavingId") REFERENCES "TargetSaving"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fixedSavingId_fkey" FOREIGN KEY ("fixedSavingId") REFERENCES "FixedSaving"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionMonth" ADD CONSTRAINT "ContributionMonth_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinContribution" ADD CONSTRAINT "JoinContribution_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "Contribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinContribution" ADD CONSTRAINT "JoinContribution_serverUserId_fkey" FOREIGN KEY ("serverUserId") REFERENCES "ServerUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionUserMonth" ADD CONSTRAINT "ContributionUserMonth_joinContributionId_fkey" FOREIGN KEY ("joinContributionId") REFERENCES "JoinContribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
