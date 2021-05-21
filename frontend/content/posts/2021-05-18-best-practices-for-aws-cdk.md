---
title: Best practices for aws-cdk
subtitle: An opinionated view on how to work with Constructs
author: Matthew Keil
hero: static/media/ancient.jpg
prominent: false
published: 2021-05-18T02:30:38.132Z
updated: true
tags:
  - aws
  - aws-cdk
  - typescript
---

Best practices are opinions. And you know what they say about opinions? They are like assholes; everyone has one, but few pass the sniff test. So as long as that is the basis that we are building from feel free to take these and jazz them up to your own liking.

These are a flexible set of guidelines to help you on your journey with using the aws-cdk in production. It doesn't matter if you are building [open-source constructs](https://github.com/nomad-house/cdk), or working for internal clients in a rapid-fire development environment, coordinating resources can be a challenge. Considering that multiple devs will be working on multiple branches, across multiple accounts we are going to need to be methodically to keep everyone running on the rails. It's from this spirit that this post was born.

## Why?

There are many key aspects to a great DX, developer experience, and a few that we will focus on are intuitive and easy to use, consistent and extensible. We don't write code for computers to read, we write code for other developers to read. We want to build objects that other developers want to use. When we are detailed in how we go about things, like naming, we make lives easier.

This concept will carry us far beyond the code. By having consistency with how we structure our cdk Constructs we will enable ease of finding what we are looking for in the console. The AWS console is wonderful AND terrible. Newcomers to the cloud are completely overwhelmed and fiddling with it never gets easier. When you rarely have to "go into the console to touch stuff" you are officially a cloud pro. But that won't change the fact that you will need to go to now and again. And when you get to the cloud pro level, and you do find yourself HAVING to go, the issue will be severe, because your Jr. has escalated this to you.... reluctantly.

That is when these details will have the **most** benefit. Being able to track down what is what, will make your life easier from cradle to grave and we will hold each others' hands as we go down this path together. Just grit your teeth and know we will be better for it. Promise.

## What's in a name?

Physical resource id naming methodology is as contentious as tabs vs spaces <<waits for arguing to stop>>. And we all have our path along that journey. There are a few common points that everyone (mostly because they are dictated by the aws platform) agrees to. I learned quickly that kebab case was "the case" to use when building physical Id's. I found it easier to read than PascalCase and it is nice to differentiate the physicalId's from the logicalId's. When scripting the templates the second point is less important but the ease of readability is huge when one gets to the console. Trying to read function names in a huge long list of 50 character long PascalCased function names... it blurs the eyes. Search-ability is an important goal both for screen parsing and for the search box on each page of the console.

Which brings me to my next point. When I first started forming my "naming opinion" I looked at resource names in the context of all the other resource names. I wanted to be descriptive and call a spade a "spade." I called roles "_-role" and buckets "_-bucket". I figured that was the surest way to know what something was when I saw a long list of resource names. But I neglected unknowingly that I would never see "bucketNames" listed next the "functionNames" ever. Like never. One of the nicest parts of the aws console is that it doesn't really repeat itself much. It's pretty good when it comes to its UX such that resources are listed together as a group of that type of resource within a single view.

So when switching between views, there is no benefit to renaming the role, policy, function, logGroup differently (ie adding the '\*-type' suffix) and in fact you will get a visual detriment in the fact that the words will be "different" and the brain will have to reprocess as opposed to just pattern matching the last "name" it saw and looking for it again. By using the same "prefix" to denote all related resources its much easier for the brain to "pick the right one" out of a list of potentials.

So the task at hand for organizing our resources, both within our cdk constructs and within the console for debugging and analysis, is to come up with the perfect "prefix." The holy grail of logicalId naming. Yes, think Indiana Jones folks! It's that big! (the size of my devops nerd-out you ask?)

## The Prefix

There is a huge topic that we have yet to cover and it's resource naming collisions. If you've deployed your first stack for the second time, you know what I mean. Like 101 but possibly one of the most difficult parts to get right for large scale operations. You see when things get too verbose, naming get long and character limits start to kick in. The big one being 64 characters. Roles, policies, functions, and buckets all share that maximum. No more you say, then be better I say. This is what drove me to get rid of the '_-bucket' and '_-role' in the first place. Not the ease of reading. It was debugging for lots of large and challenging clients over the years that taught me the latter.

They key is to be precise enough to tell what stuff is but make sure its terse enough to fit. It also needs to accommodate branching strategies that occur during the normal development cycle. This is where I came up with the `${client}-${project}-${stage}` prefix idea. The client and project part is easy, most customers are repeat customers, and often they have multiple internal clients and projects. Being able to stand all of those stacks, and by reference resources in the same account means those two pieces need to always be there. The stage part is more for the development environment.

If one is using a prod account and a dev account the dev account will get a bit messy. A team development account is another great example of what I'm talking about. There are lots, and lots of branches in progress, and thus lots of stacks. This is when the `-${stage}` comes in handy. In one's own personal account there will come a time when you want to have a couple of branches built at once. A client may want a preview or a hobby can grow into a multi-environment animal.

## Coordinated Resource Names

Now that we have a nice prefix. Use it freely. Everywhere I tell you... Most importantly use it for the stack name. And everything within that stack, ideally, will have a physicalId (name) that starts with that stack name. Then pass around that prefix variable and it'll make a handy way to append on suffixes for more specific names, like functions. There are some things that we create that there will be many of per stack. Functions, log groups, roles, etc being a few examples. For those the way to name them is with a `${prefix}-thingy` name where "thingy" is the thingy you are trying to name.

As an example, to create a function, one needs to make a role, possibly a separate policy, a log group and the function itself. These things are all related to each other, support only each other, and should all share the same name. Ideally the function will have a file that it lives in and it, as an example, is called `doSomethingFancy.ts`. Because we are expressive coders, we have named our function representatively of "what it does" and by extension as cloud coders we want to name our resources expressively. We want to correlate the fancy somethings and thusly we will not only name our function with this but we will also name the log group, role, policy and anything else explicitly tied to the functionality of "doing something fancy."

```typescript
const functionName = `${prefix}-do-something-fancy`;

const function = new Function(this, '', {
    functionName: functionName
});
const role = new Role(this, '', {
    roleName: functionName
});
const policy = new Policy(this, '', {
    policyName: functionName
});
const logGroup = new LogGroup(this, '', {
    logGroupName: functionName
});
```

## Asynchronous Constructs

TypeScript is a wonderful language, but it's nuances make it a challenge. One of which being the strictly synchronous constructor function in class syntax. It's a drag for cdk because setting values in `.then()` in a constructor is just not possible, when values are shared between constructs, and still guarantee the cdk token resolution happens correctly. There is a solution though...

```typescript [AsyncStack.ts]
interface SyncProps extends StackProps {}
export interface AsyncProps extends SyncProps {}

export class AsyncStack extends Stack {
  private constructor(scope: Construct, id: string, props: SyncProps) {}
  public static async create(scope: Construct, id: string, props: AsyncProps) {
    /**
     * Do some async stuff and return values
     */
    return new AsyncStack(scop, id, {
      ...props,
      prop1: asyncValue1,
      props2: asyncValue2,
    })
  }
}
```

```typescript [infra.ts]
async function buildInfra() {
  const app = new App()
  const asyncStack = await AsyncStack.create(app, 'AsyncStack', {})
  const otherStack = new OtherStack(app, 'OtherStack', {
    bucket: asyncStack.bucket,
  })
}

buildInfra()
```

## Dealing with Circular References

The dreaded dependency circular reference. They are the worst problem ever the first time you get one, and it's no different with cdk. Debugging them can be a bit differnt than other places though. Generally they refer to values that are not available until after deploy. I've had a situation similar to the one below

```typescript
const frontEndStack = new FrontEndStack(this, '', {})
const bucket = frontEndStack.bucketYouExported

const policy = new PolicyStatement({
  resources: [`${bucket.bucketWebsiteUrl}/for-a-policy-document`],
})
```

A value was needed at runtime because of the string literal. The literal value needed to be available. That cannot be available though until after deployment time (ie the template needs to be built already). So you end up in a loop due to the recursive way values are determined during synth time. It showed up in my instance as a circular dependency. The way to solve this problem is to use an intrinsic function.

```typescript
const frontEndStack = new FrontEndStack(this, '', {})
const bucket = frontEndStack.bucketYouExported

const policy = new PolicyStatement({
  resources: [Fn.Join('/', [bucket.bucketWebsiteUrl. "for-a-policy-document"],
})
```

By shifting the dependency until cloudformation execution time it allows the templating algorithm to calculate all of the values and synthesize the template. Then the CloudFormation service takes over and handles the order with which resources are built. The other place it happened was when I migrated some constructs to a different format. I developed a nice pattern of allowing both individual stack and nested stack from the same construct.

```typescript
export class ApiStack extends Stack {}
// was renamed to be this
export class ApiConstruct extends Construct {}
// but this is what I actually did
export class ApiConstruct extends Stack {}

// so when I built the "new" stack
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    const construct = new ApiConstruct(this, 'ApiConstruct', props)
  }
}
```

So I updated the Stack to a Construct for import into the Stack and NestedStack extended classes, but I neglected to change the extended class from Stack to Construct and the error that came back was a circular dependency. Thank god! for Jeff that day, or I would have pulled out my hair. It kept talking about a bucket but that was the first resource inside of the construct. Key being here, stacks cant get built inside other stacks.

## Debugging Templates

## Packaging Constructs
