#import "XpushCore.h"
#import "RCTConvert.h"

@implementation XpushCore

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(login:(NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback)
{
  NSString *userId = @"";
  if ([options objectForKey:@"userId"] && [options objectForKey:@"userId"] != [NSNull null]) {
    userId = [RCTConvert NSString:options[@"userId"]];
  }
  
  NSString *password = @"";
  if ([options objectForKey:@"password"] && [options objectForKey:@"password"] != [NSNull null]) {
    password = [RCTConvert NSString:options[@"password"]];
  }
  
  callback(@[@"success"]);
}

RCT_EXPORT_METHOD(send:(NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback)
{
  NSString *message = @"";
  if ([options objectForKey:@"message"] && [options objectForKey:@"message"] != [NSNull null]) {
    message = [RCTConvert NSString:options[@"message"]];
  }
  
  callback(@[@"success"]);
}