/** @type {import('next').NextConfig} */
const githubPages = process.env.DEPLOY_TARGET === 'gh-pages'

const githubPagesConfig = {
    output: "export",
    basePath: "/nft-demo",
    images: {
        unoptimized: true,
    }
}

const nextConfig = {}

module.exports = githubPages ? githubPagesConfig : nextConfig
